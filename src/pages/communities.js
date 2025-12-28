// Link CSS
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "src/utils/css/community.css";
document.head.appendChild(link);

// Mock session user data
const sessionUser = {
  id: "user_1",
  username: "You",
  joinedCommunities: [] // will be fetched later
};

const MAX_COMMUNITIES = 1000;

function initCommunities(container) {
  container.innerHTML = `
    <div class="communities-layout">

      <!-- Sidebar -->
      <aside class="communities-sidebar">
        <div class="sidebar-header">
          <h2>Communities</h2>
        </div>

        <div class="search-communities">
          <input type="text" id="communitySearch" placeholder="Search My Communities">
        </div>

        <div class="communities-list" id="communityList">
          <p class="empty-text">You haven't joined any communities.</p>
        </div>

        <button class="create-community-btn" id="createCommunityBtn">
          Create Community
        </button>
      </aside>

      <!-- Content -->
      <main class="community-content" id="communityContent">
        <div class="empty-state">
          <h2>Select a community</h2>
          <p>Choose one from the left to view it</p>
        </div>
      </main>

    </div>
  `;

  loadUserCommunities();
  setupCommunityUI();
}

/* data fetching (mock) */

function fetchUserCommunities() {
  // replace with db call later
  return sessionUser.joinedCommunities;
}

function fetchCommunityById(id) {
  // replace with db call later
  return {
    id,
    name: "Example Community",
    creator: "SomeUser",
    description: "Community description goes here.",
    members: 42
  };
}

/* sidebar view */

function loadUserCommunities() {
  const list = document.getElementById("communityList");
  const communities = fetchUserCommunities();

  list.innerHTML = "";

  if (communities.length === 0) {
    list.innerHTML = `<p class="empty-text">You haven't joined any communities.</p>`;
    return;
  }

  communities.slice(0, MAX_COMMUNITIES).forEach(c => {
    const div = document.createElement("div");
    div.className = "community-item";
    div.textContent = c.name;
    div.dataset.id = c.id;

    div.onclick = () => loadCommunity(c.id);
    list.appendChild(div);
  });
}

/* main view */

function loadCommunity(id) {
  const data = fetchCommunityById(id);
  const isMember = sessionUser.joinedCommunities.some(c => c.id === id);
  const content = document.getElementById("communityContent");

  content.innerHTML = `
    <div class="community-header">
      <h1>${data.name}</h1>
      <p>By ${data.creator}</p>
    </div>

    <div class="community-actions">
      ${
        isMember
          ? `<button class="leave-btn" id="leaveCommunityBtn">Leave Community</button>`
          : `<button class="join-btn" id="joinCommunityBtn">Join Community</button>`
      }
    </div>

    <section class="community-about">
      <h2>About</h2>
      <p>${data.description}</p>
    </section>
  `;

  if (isMember) {
    document.getElementById("leaveCommunityBtn").onclick = () => {
      sessionUser.joinedCommunities =
        sessionUser.joinedCommunities.filter(c => c.id !== id);
      loadUserCommunities();
      loadCommunity(id);
    };
  } else {
    document.getElementById("joinCommunityBtn").onclick = () => {
      if (sessionUser.joinedCommunities.length >= MAX_COMMUNITIES) {
        alert("Community limit reached (1000)");
        return;
      }

      sessionUser.joinedCommunities.push({
        id,
        name: data.name
      });

      loadUserCommunities();
      loadCommunity(id);
    };
  }
}

/* ui events */

function setupCommunityUI() {
  const search = document.getElementById("communitySearch");

  search.addEventListener("input", () => {
    const query = search.value.toLowerCase();
    document.querySelectorAll(".community-item").forEach(item => {
      item.style.display =
        item.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
  });

  document.getElementById("createCommunityBtn").onclick = () => {
    alert("Create Community UI comes later (after auth)");
  };
}

/* router hook */

window.initCommunities = initCommunities;
