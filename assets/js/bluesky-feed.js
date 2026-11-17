const root = document.getElementsByTagName("bsky-feed")[0];
const handle = root.getAttribute("handle");
const cssURL = root.getAttribute("cssURL");
const limit = root.getAttribute("limit");
const loadMore = root.getAttribute("loadMore");
const loadingText = root.getAttribute("loading");
const postsWithReplies = root.getAttribute("postsWithReplies") === "true" ? true : false;

if (root && handle) {
  // Load the Hugo-built stylesheet.
  if (cssURL && !document.querySelector('link[data-bluesky-feed-css]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = cssURL;
    stylesheet.dataset.blueskyFeedCss = "";
    document.head.append(stylesheet);
  }

  const api = "https://public.api.bsky.app/xrpc/";
  const pageSize = Number(limit);
  const postsContainer = document.createElement("div");
  const status = document.createElement("p");
  const loadButton = document.createElement("button");

  const svgRepost = '<svg viewBox="0 0 576 512" height="16" width="16" tabindex="-1" class="mr-1"><path fill="currentColor" d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96H272zM304 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128H416c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-32 0V192c0-53-43-96-96-96L304 96z"></path></svg>';
  const svgReply = '<svg fill="none" viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" stroke="none" stroke-width="0" stroke-linecap="butt" stroke-linejoin="miter" fill-rule="evenodd" clip-rule="evenodd" d="M15.793 10.293a1 1 0 0 1 1.338-.068l.076.068 3.293 3.293a2 2 0 0 1 .138 2.677l-.138.151-3.293 3.293a1 1 0 1 1-1.414-1.414L18.086 16H8a5 5 0 0 1-5-5V5a1 1 0 0 1 2 0v6a3 3 0 0 0 3 3h10.086l-2.293-2.293-.068-.076a1 1 0 0 1 .068-1.338Z"></path></svg>';

  status.className = "bsky-status";
  status.setAttribute("aria-live", "polite");

  loadButton.className = "bsky-load-more";
  loadButton.type = "button";
  loadButton.textContent = loadMore;
  loadButton.hidden = true;

  root.append(postsContainer, status, loadButton);

  let cursor = "";
  let loading = false;

  function renderQuotedPost(embed) {
    // A quote can be attached by itself or alongside media.
    const recordEmbed =
      embed?.$type === "app.bsky.embed.recordWithMedia#view"
        ? embed.record
        : embed;

    if (recordEmbed?.$type !== "app.bsky.embed.record#view") {
      return null;
    }

    const quoted = recordEmbed.record;

    // Only render when the embedded record is an available post.
    if (quoted?.$type !== "app.bsky.embed.record#viewRecord") {
      return null;
    }

    const handle = quoted.author?.handle ?? "unknown";
    const displayName = quoted.author?.displayName || handle;
    const text = quoted.value?.text ?? "";
    const rkey = quoted.uri?.split("/").pop();

    const card = document.createElement("a");
    card.className = "quoted-post-card";
    card.href = rkey
      ? `https://bsky.app/profile/${encodeURIComponent(handle)}/post/${encodeURIComponent(rkey)}`
      : "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const author = document.createElement("div");
    author.className = "quoted-post-author";
    author.textContent = `${displayName} · @${handle}`;

    const body = document.createElement("div");
    body.className = "quoted-post-text";
    body.textContent = text;

    card.append(author, body);
    return card;
  }


  function isQuotePost(post) {
    const embed = post.embed;
    if (!embed) return false;

    // For recordWithMedia, the quoted-record reference is nested one level deeper.
    const ref = embed.record?.record ?? embed.record;
    return ref?.uri?.includes("/app.bsky.feed.post/") ?? false;
  }

  function isLTR(text) {
    if ((/[\u0590-\u05FF]/).test(text.textContent))
      return false;
    else
      return true;
  }

  function getParentAuthor(uri) {
    const params = new URLSearchParams({
      uri,
      parentHeight: "1",
      depth: "0",
    });

    const data = fetch(
      `${api}app.bsky.feed.getPostThread?${params}`).then(response => response.json())
      .then(data => {
        const author = data.thread?.parent?.post.author;
        return author;
      })
      .catch(error => console.error(error));
    return data;
  }

  function appendTextWithLinks(container, text) {
    const urlPattern = /https?:\/\/[^\s<]+/g;
    let lastIndex = 0;
    let match;

    while ((match = urlPattern.exec(text)) !== null) {
      container.append(document.createTextNode(text.slice(lastIndex, match.index)));

      const link = document.createElement("a");
      link.href = match[0];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = match[0];
      container.append(link);

      lastIndex = match.index + match[0].length;
    }

    container.append(document.createTextNode(text.slice(lastIndex)));
  }

  function makePost(item) {
    const post = item.post;
    const record = post.record || {};
    const author = post.author || {};
    const postUri = post.uri;
    const postKey = post.uri.split("/").pop();
    const postUrl =
      `https://bsky.app/profile/${encodeURIComponent(author.handle || handle)}` +
      `/post/${encodeURIComponent(postKey)}`;

    const article = document.createElement("article");
    article.className = "bsky-post";

    let itemLabel = "";
    if (item.reason?.$type === "app.bsky.feed.defs#reasonRepost" || isQuotePost(post)) {
      itemLabel = svgRepost;
      item['kind'] = "repost";
    }
    else if (record.reply) {
      itemLabel = svgReply;
      item['kind'] = "reply";
    }

    const meta = document.createElement("div");
    meta.className = "bsky-meta";

    if (author.avatar) {
      const avatar = document.createElement("img");
      avatar.className = "bsky-avatar";
      avatar.src = author.avatar;
      avatar.alt = "";
      avatar.loading = "lazy";
      meta.append(avatar);
    }

    const identity = document.createElement("div");
    identity.className = "bsky-identity";
    const name = document.createElement("div");
    name.className = "bsky-name";
    name.textContent = author.displayName || author.handle || "Bluesky user";

    const userHandle = document.createElement("span");
    userHandle.className = "bsky-handle";
    userHandle.textContent = author.handle ? `@${author.handle}` : "";

    identity.append(name);
    const userAndTime = document.createElement("div");
    userAndTime.className = "bsky-handle-time";
    meta.append(identity);

    const date = document.createElement("time");
    date.className = "bsky-date";

    if (record.createdAt) {
      const postedAt = new Date(record.createdAt);

      if (!Number.isNaN(postedAt.getTime())) {
        date.dateTime = postedAt.toISOString();
        date.title = postedAt.toLocaleString();

        const seconds = Math.max(0, Math.floor((Date.now() - postedAt) / 1000));
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
          date.textContent = "now";
        } else if (minutes < 60) {
          date.textContent = `${minutes}m`;
        } else if (hours < 24) {
          date.textContent = `${hours}h`;
        } else if (days < 7) {
          date.textContent = `${days}d`;
        } else if (days < 30) {
          date.textContent = `${Math.floor(days / 7)}w`;
        } else if (days < 365) {
          date.textContent = `${Math.floor(days / 30)}mo`;
        } else {
          date.textContent = `${Math.floor(days / 365)}y`;
        }
      }
    }

    const seperator = document.createElement("span");
    seperator.className = "bsky-seperator";
    seperator.innerHTML = "·";
    userAndTime.append(date, seperator, userHandle);
    meta.append(userAndTime);

    if (item.kind === "reply") {
      const labelParent = document.createElement("div");
      const label = document.createElement("span")
      label.className = "bsky-repost";
      label.innerHTML = itemLabel;
      getParentAuthor(postUri)
        .then(au => au?.displayName)
        .then(parentAuthorName => {
          const parentAuthorSpan = document.createElement("span");
          parentAuthorSpan.innerHTML = parentAuthorName;
          labelParent.append(parentAuthorSpan);
          labelParent.append(label);
          meta.append(labelParent);
        });
    }

    if (item.kind === "repost") {
      const label = document.createElement("div")
      label.className = "bsky-repost";
      label.innerHTML = itemLabel;
      meta.append(label);
    }

    article.append(meta);

    if (record.text) {
      const text = document.createElement("div");
      text.className = "bsky-text";
      appendTextWithLinks(text, record.text);
      if (isLTR(text)) {
        text.style = "direction: ltr";
      }
      article.append(text);
    }

    const embed = post.embed;
    const images = embed?.images || embed?.media?.images;

    if (Array.isArray(images) && images.length) {
      const gallery = document.createElement("div");
      gallery.className = "bsky-images";

      for (const image of images) {
        const imageUrl = image.thumb || image.fullsize;
        if (!imageUrl) continue;

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = image.alt || "";
        img.loading = "lazy";
        gallery.append(img);
      }

      if (gallery.childElementCount) article.append(gallery);
    }

    const external = post.embed?.external || post.embed?.media?.external;

    if (external?.uri) {
      let url;

      try {
        url = new URL(external.uri);
        if (!["http:", "https:"].includes(url.protocol)) url = null;
      } catch {
        url = null;
      }

      if (url) {
        const card = document.createElement("a");
        card.className = "bsky-link-card";
        card.href = url.href;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        if (external.thumb) {
          const thumbnail = document.createElement("img");
          thumbnail.className = "bsky-link-thumb";
          thumbnail.src = external.thumb;
          thumbnail.alt = "";
          thumbnail.loading = "lazy";
          card.append(thumbnail);
        }

        const details = document.createElement("div");
        details.className = "bsky-link-details";

        const title = document.createElement("div");
        title.className = "bsky-link-title";
        title.textContent = external.title || external.uri;
        details.append(title);

        if (external.description) {
          const description = document.createElement("div");
          description.className = "bsky-link-description";
          description.textContent = external.description;
          details.append(description);
        }

        const domain = document.createElement("div");
        domain.className = "bsky-link-domain";
        domain.textContent = url.hostname;
        details.append(domain);

        if (isLTR(details)) {
          details.style = "direction: ltr";
        }
        card.append(details);
        article.append(card);
      }
    }

    const quoteCard = renderQuotedPost(embed);
    if (quoteCard) {
      article.append(quoteCard);
    }

    const actions = document.createElement("div");

    actions.className = "bsky-actions";
    actions.append(
      document.createTextNode(
        `♥ ${post.likeCount || 0}　↻ ${post.repostCount || 0}　↲ ${post.replyCount || 0}`
      )
    );

    const link = document.createElement("a");
    link.href = postUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on Bluesky";
    actions.append(link);

    article.append(actions);
    return article;
  }

  async function loadPage() {
    if (loading) return;

    loading = true;
    loadButton.disabled = true;
    status.textContent = loadingText;

    try {
      const query = new URLSearchParams({
        actor: handle,
        filter: postsWithReplies ? "posts_with_replies" : "posts_no_replies",
        limit: String(pageSize)
      });

      if (cursor) query.set("cursor", cursor);

      const response = await fetch(
        `${api}app.bsky.feed.getAuthorFeed?${query.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();

      for (const item of data.feed || []) {
        postsContainer.append(makePost(item));
      }

      cursor = data.cursor || "";
      loadButton.hidden = !cursor;
      status.textContent = postsContainer.childElementCount
        ? ""
        : "No public posts found for this account.";
    } catch (error) {
      status.textContent = `Could not load the feed: ${error.message}`;
      loadButton.hidden = false;
    } finally {
      loading = false;
      loadButton.disabled = false;
    }
  }

  loadButton.addEventListener("click", loadPage);
  loadPage();
}
