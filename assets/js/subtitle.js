import statusList from 'data/status_list.json'

async function getRandomStatus() {
    let index = Math.floor(Math.random() * statusList.statuses.length);
    let result = statusList.statuses[index];
    return result;
}
let subtitle = document.getElementById("blog_status");
getRandomStatus().then((result) => (subtitle.innerHTML = result));