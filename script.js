//GitHub API'sinin kullanıcı bilgilerini almak için temel URL'si.
const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

getUser("senagencalp");

//Bir kullanıcı adı alır ve bu kullanıcıya ait bilgileri GitHub API'sinden çeker. Ardından kullanıcı kartını oluşturur ve bu kullanıcının depolarını alır.
async function getUser(username) {
  const resp = await fetch(APIURL + username);
  const respData = await resp.json();

  createUserCard(respData);

  getRepos(username);
}

//getRepos: Bir kullanıcı adı alır ve bu kullanıcının depolarını GitHub API'sinden çeker. Ardından bu depoları kullanıcı kartına ekler.
async function getRepos(username) {
  const resp = await fetch(APIURL + username + "/repos");
  const respData = await resp.json();

  addReposToCard(respData);
}

//createUserCard: Kullanıcı bilgilerini alır ve HTML içeriği oluşturur. Bu içerik main elementine eklenir.
function createUserCard(user) {
  const cardHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>

                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `;

  main.innerHTML = cardHTML;
}
//addReposToCard: Depoları alır, onları yıldız sayısına göre sıralar ve en popüler 10 tanesini kullanıcı kartına ekler.
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .forEach((repo) => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");

      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;

      reposEl.appendChild(repoEl);
    });
}

//Form Dinleyicisi: Form gönderildiğinde (submit olayı), sayfanın yeniden yüklenmesini önler ve search kutusundaki değeri kullanarak getUser fonksiyonunu çağırır.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
