/* // Mastodon embed timeline
// Forked from: https://github.com/AzetJP/mastodon-timeline-widget

// Account settings
document.addEventListener("DOMContentLoaded", () => {
  let mapi = new MastodonApi({
    container_id: "mt-timeline",
    container_body_id: "mt-body",
    instance_uri: "https://tooot.im",
    user_id: "109290473034925778",
    profile_name: "@aizenimr",
    toots_limit: 10,
    btn_see_more: "פוסטים נוספים",
  });
});

let MastodonApi = function (params_) {
  // Endpoint access settings
  this.INSTANCE_URI = params_.instance_uri;
  this.USER_ID = params_.user_id;
  this.PROFILE_NAME = params_.profile_name;
  this.TOOTS_LIMIT = params_.toots_limit || 20;
  this.BTN_SEE_MORE = params_.btn_see_more || "See more";

  // Target selectors
  this.mtIdContainer = document.getElementById(params_.container_id);
  this.mtBodyContainer = document.getElementById(params_.container_body_id);

  // Get the toots
  this.getToots();

  // Toot interactions
  this.mtIdContainer.addEventListener("click", function (event) {
    let urlToot = event.target.closest(".mt-toot").dataset.location;
    // Open Toot in new page avoiding any other natural link
    if (
      event.target.localName != "a" &&
      event.target.localName != "span" &&
      urlToot
    ) {
      window.open(urlToot, "_blank");
    }
  });
};

// Listing toots function
MastodonApi.prototype.getToots = function () {
  let mapi = this;

  // Get request
  fetch(
    this.INSTANCE_URI +
      "/api/v1/accounts/" +
      this.USER_ID +
      "/statuses?limit=" +
      this.TOOTS_LIMIT,
    {
      method: "get",
    }
  )
    .then((response) => response.json())
    .then((jsonData) => {
      // console.log('jsonData: ', jsonData);

      // Clear the loading message
      this.mtBodyContainer.innerHTML = "";

      // Add toots
      for (let i in jsonData) {
        if (jsonData[i].visibility == "public") {
          // List only public toots
          appendToot.call(mapi, jsonData[i]);
        }
      }

      // Add target="_blank" to all hashtags
      let allHashtags = document.querySelectorAll("#mt-timeline .hashtag");
      for (let j = 0; j < allHashtags.length; j++) {
        allHashtags[j].target = "_blank";
        allHashtags[j].rel = "tag noopener noreferrer";
      }

      // Insert button to visit account page, after last toot
      this.mtBodyContainer.insertAdjacentHTML(
        "beforeend",
        '<div class="mt-seeMore"><a href="' +
          mapi.INSTANCE_URI +
          "/" +
          mapi.PROFILE_NAME +
          '" class="btn" target="_blank" rel="noopener noreferrer">' +
          mapi.BTN_SEE_MORE +
          "</a></div>"
      );
    })
    .catch((err) => {
      this.mtBodyContainer.innerHTML =
        '<div class="d-flex h-100"><div class="w-100 my-auto text-center">✖️<br/>Request Failed:<br/>' +
        err +
        "</div></div>";
    });

  // Inner function to add each toot content in container
  let appendToot = function (status_) {
    let avatar, user, content, url, date;

    if (status_.reblog) {
      // BOOSTED toot
      // Toot url
      url = status_.reblog.url;

      // Boosted avatar
      avatar =
        '<a href="' +
        status_.reblog.account.url +
        '" class="mt-avatar mt-avatar-boosted" style="background-image:url(' +
        status_.reblog.account.avatar +
        ');" rel="noopener noreferrer" target="_blank">' +
        '<div class="mt-avatar mt-avatar-booster" style="background-image:url(' +
        status_.account.avatar +
        ');">' +
        "</div>" +
        '<span class="visually-hidden">' +
        "@" +
        status_.account.username +
        " avatar" +
        "</span>" +
        "</a>";

      // User name and url
      user =
        '<div class="mt-user">' +
        '<a href="' +
        status_.reblog.account.url +
        '" rel="noopener noreferrer" target="_blank">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="15"><path d="m 4.2439268,0.02472098 c -0.1,0.03 -0.17,0.1 -0.22,0.18 L 0.07392676,5.104721 c -0.2,0.3 0.03,0.78 0.4,0.8 H 2.8739268 v 2.68 c 0,4.26 -0.55,3.62 3.66,3.62 h 7.6600002 l -2.3,-2.84 c -0.03,-0.02 -0.03,-0.04 -0.05,-0.06 H 6.5439268 c -0.44,0 -0.72,-0.3 -0.72,-0.72 v -2.7 h 2.5 c 0.37,0.03 0.63,-0.48 0.4,-0.77 l -3.95,-4.90000002 c -0.12,-0.17 -0.34,-0.25 -0.53,-0.2 z m 12.1600002,0.43 c -0.55,-0.02 -1.32,0.02 -2.4,0.02 H 6.3739268 l 2.32,2.85000002 0.03,0.06 h 5.2500002 c 0.42,0 0.72,0.28 0.72,0.72 v 2.7 h -2.5 c -0.36,0.02 -0.56,0.54 -0.3,0.8 l 3.92,4.9 c 0.18,0.25 0.6,0.25 0.78,0 l 3.94,-4.9 c 0.26,-0.28 0,-0.83 -0.37,-0.8 h -2.49 v -2.7 c 0,-3.15000002 0.4,-3.62000002 -1.25,-3.66000002 z" fill="#555555" stroke-width="0"/></svg>' +
        "@" +
        status_.reblog.account.username +
        '<span class="visually-hidden"> post</span>' +
        "</a>" +
        "</div>";

      // Date
      date = this.formatDate(status_.reblog.created_at);
    } else {
      // STANDARD or REPLY toot
      // Toot url
      url = status_.url;

      // Avatar
      avatar =
        '<a href="' +
        status_.account.url +
        '" class="mt-avatar" style="background-image:url(' +
        status_.account.avatar +
        ');" rel="noopener noreferrer" target="_blank">' +
        '<span class="visually-hidden">' +
        "@" +
        status_.account.username +
        " avatar" +
        "</span>" +
        "</a>";

      let svgIcon = "";
      if (status_.in_reply_to_account_id != null) {
        svgIcon =
          '<svg width="22.000402" height="19.654003" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g id="g6" transform="matrix(0.02244939,0,0,0.02244939,-0.2244939,-1.3967893)"><path d="M 897.6,361.9 C 829,291.6 719.8,251.3 570,241.1 V 97.8 C 570,82.5 562.9,71.7 548.7,65.5 533.8,59.3 521,61.9 510.4,73.2 l -280,280 c -6.9,6.9 -10.4,15.1 -10.4,24.6 0,9.5 3.5,17.7 10.4,24.6 l 280,280 c 6.6,6.9 14.8,10.4 24.6,10.4 4.4,0 8.9,-0.9 13.7,-2.7 14.2,-6.2 21.3,-16.9 21.3,-32.3 V 520.5 c 58.7,4.7 107.4,14.3 146.3,28.7 38.8,14.4 69.9,34.5 93.2,60.4 54.3,60.2 73.7,163.1 58,309 -0.7,9.5 3.5,15.7 12.6,18.6 1.1,0.4 2.7,0.5 4.9,0.5 7.3,0 12.4,-3.1 15.3,-9.3 l 10.9,-21.9 c 5.1,-10.2 12.5,-26.7 22.1,-49.5 9.7,-22.8 18.4,-45.6 26.3,-68.4 7.8,-22.8 14.9,-47.9 21.1,-75.5 6.2,-27.5 9.3,-51.9 9.3,-73 C 990,517.8 959.2,425 897.6,361.9 Z" fill="#555555" id="path2" /><path d="m 132.5,377.8 c 0,-9.5 3.5,-17.7 10.4,-24.6 L 360,135.5 V 97.8 C 360,82.5 352.9,71.7 338.7,65.5 323.8,59.3 311,61.9 300.4,73.2 l -280,280 c -6.9,6.9 -10.4,15.1 -10.4,24.6 0,9.5 3.5,17.7 10.4,24.6 l 280,280 c 6.6,6.9 14.8,10.4 24.6,10.4 4.4,0 8.9,-0.9 13.7,-2.7 14.2,-6.2 21.3,-16.9 21.3,-32.3 V 619.5 L 142.9,402.4 c -6.9,-6.9 -10.4,-15.1 -10.4,-24.6 z" fill="#555555" id="path4" /></g></svg>';
      }

      // User name and url
      user =
        '<div class="mt-user"><a href="' +
        status_.account.url +
        '" rel="noopener noreferrer" target="_blank">' +
        svgIcon +
        "@" +
        status_.account.username +
        '<span class="visually-hidden"> post</span></a></div>';

      // Date
      date = this.formatDate(status_.created_at);
    }

    // Main content
    if (status_.spoiler_text != "") {
      content =
        '<div class="toot-text">' +
        status_.spoiler_text +
        " [Show more...]" +
        "</div>";
    } else if (status_.reblog && status_.reblog.content != "") {
      content = '<div class="toot-text">' + status_.reblog.content;
      +"</div>";
    } else {
      content = '<div class="toot-text">' + status_.content + "</div>";
    }

    content = content.replace(
      /<span class=\"h-card\">/g,
      '<span class="h-card" dir="ltr">'
    );

    // Media attachments
    let media = "";
    if (status_.media_attachments.length > 0) {
      for (let picid in status_.media_attachments) {
        media = this.replaceMedias(
          status_.media_attachments[picid],
          status_.sensitive
        );
      }
    }
    if (status_.reblog && status_.reblog.media_attachments.length > 0) {
      for (let picid in status_.reblog.media_attachments) {
        media = this.replaceMedias(
          status_.reblog.media_attachments[picid],
          status_.sensitive
        );
      }
    }

    // Poll
    let poll = "";
    let pollOption = "";
    if (status_.poll) {
      for (let i in status_.poll.options) {
        pollOption += "<li>" + status_.poll.options[i].title + "</li>";
      }
      poll =
        '<div class="toot-poll">' + "<ul>" + pollOption + "</ul>" + "</div>";
    }

    // Date
    let timestamp =
      '<div class="toot-date">' +
      '<a href="' +
      url +
      '" rel="noopener noreferrer" tabindex="-1" target="_blank">' +
      date +
      "</a>" +
      "</div>";

    // Add all to main toot container
    let toot =
      '<div class="mt-toot border-bottom" data-location="' +
      url +
      '">' +
      avatar +
      user +
      content +
      media +
      poll +
      timestamp +
      "</div>";

    this.mtBodyContainer.insertAdjacentHTML("beforeend", toot);
  };
};

// Place media
MastodonApi.prototype.replaceMedias = function (media_, spoiler_) {
  let spoiler = spoiler_ || false;
  let pic =
    '<div class="toot-media ' +
    (spoiler ? "toot-media-spoiler" : "") +
    ' img-ratio14_7 loading-spinner">' +
    '<img onload="removeSpinner(this)" onerror="removeSpinner(this)" src="' +
    media_.preview_url +
    '" alt="" loading="lazy" />' +
    "</div>";

  return pic;
};

// Format date
MastodonApi.prototype.formatDate = function (date_) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let date = new Date(date_);

  let displayDate =
    monthNames[date.getMonth()] +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear();

  return displayDate;
};

// Loading spinner
function removeSpinner(element) {
  const spinnerCSS = "loading-spinner";
  // Find closest parent container (1st, 2nd or 3rd level)
  let spinnerContainer = element.closest("." + spinnerCSS);
  if (spinnerContainer) {
    spinnerContainer.classList.remove(spinnerCSS);
  }
} */

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
      document.getElementById("bskyfeed").innerHTML = html;
    });
}
