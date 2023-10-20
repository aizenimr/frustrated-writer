document.addEventListener("DOMContentLoaded", () => {
  getBskyFeed();
  setInterval(getBskyFeed, 300000);
});

function writeStatus() {
  let status = getRandomStatus();
  console.log(status);
}

function getRandomStatus() {
  fetch("/status_list.json")
    .then((response) => response.json())
    .then(
      (json) => json.statuses[Math.floor(Math.random() * json.statuses.length)]
    );
}

function getBskyElementTitle(titleElement) {
  const REPOST = '<svg viewBox="0 0 576 512" height="16" width="16" tabindex="-1" style="margin-right: 4px; min-width: 16px;"><path fill="#707177" d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32H160c-17.7 0-32-14.3-32-32V192h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96H272zM304 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128H416c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-32 0V192c0-53-43-96-96-96L304 96z"></path></svg>';
  const REPLY = '<svg viewBox="0 0 512 512" height="9" width="9" tabindex="-1" style="margin-right: 5px;"><path fill="#545664" d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"></path></svg>';
  let authors = titleElement.split(",");
  let title = "";

  if (authors[0].startsWith("Post by")) {
    title = '<div class="bskypost_author">' + authors[0].replace("Post by ", "@") + '</div>';
    if (authors.length > 1) {
      title += '<div class="bskypost_reply">' + REPLY + authors[1].replace("reply to ", "@") + '</div>';
    }
  }

  if (authors[0].startsWith("Repost by")) {
    title = '<div class="bskypost_repost">' + REPOST + authors[0].replace("Repost by ", "@") + '</div><div class="bskypost_author">' + authors[1].replace("original by ", "@") + '</div>';
  }

  return title;
}

function getBskyFeed() {
  let RSS_URL =
    "https://corsproxy.io/?" +
    encodeURIComponent(
      "https://bluestream.deno.dev/aizenimr.com?repost=include"
    );
  fetch(RSS_URL)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      const items = data.querySelectorAll("item");
      let html = ``;
      let size = 10;
      for (let i = 0; i < size; i++) {
        let el = items[i];
        let title = getBskyElementTitle(el.querySelector("title").innerHTML);
        html += `
        <div class="bskypost">
          <a href="${el.querySelector("link").innerHTML
          }" target="_blank" rel="noopener">
            ${title}
        <div class="bskypost_description">
          ${el.querySelector("description").textContent}<hr>
        </div>
      </a>
      </div>`;
      }
      document.getElementById('spinner').style.display = 'none';
      document.getElementById("bskyfeed").innerHTML = html;
    });
}
