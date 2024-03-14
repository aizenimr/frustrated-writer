document.addEventListener("DOMContentLoaded", () => {
  getBskyFeed();
  setInterval(getBskyFeed, 300000);
});

function getBskyFeed() {
  document.getElementById("bskyfeed").innerHTML = "";
  document.getElementById("spinner").style.display = "block";
  let RSS_URL =
    "https://corsproxy.io/?" +
    encodeURIComponent(
      "https://bsky.app/profile/did:plc:ijqsv7gidnh5qvnqe45g4ovt/rss"
    );
  fetch(RSS_URL)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      const items = data.querySelectorAll("item");
      let html = ``;
      let maxLength = 10;
      let size = items.length < maxLength ? items.length : maxLength;
      for (let i = 0; i < size; i++) {
        let el = items[i];
        let link = el.getElementsByTagName("link")[0].textContent;
        let description = el
          .getElementsByTagName("description")[0]
          .textContent.replaceAll("\n", "<br>");
        let pubDate = new Date(
          el.getElementsByTagName("pubDate")[0].textContent
        );
        html += `
        <div class="bskypost">
          <a href="${link}" target="_blank" rel="noopener">
          <div class="bskypost_author">@aizenimr</div>
          <div class="bskypost_time">
            ${pubDate.toLocaleDateString() + " " + pubDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        <div class="bskypost_description">
          ${description}
        </div>
      </a>
      </div>`;
      }
      document.getElementById("spinner").style.display = "none";
      document.getElementById("bskyfeed").innerHTML = html;
    });
}
