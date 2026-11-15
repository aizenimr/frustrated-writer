import * as params from "@params";

async function getRandomStatus() {
    let response = await fetch(params.statusesURL, {
        method: "GET",
        cache: "no-cache"
    });
    let obj = await response.json();
    let index = Math.floor(Math.random() * obj.statuses.length);
    let result = obj.statuses[index];
    return result;
}
let subtitle = document.getElementById("blog_status");
getRandomStatus().then((result) => (subtitle.innerHTML = result));