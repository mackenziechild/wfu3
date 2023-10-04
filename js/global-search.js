document.addEventListener("DOMContentLoaded", function () {
  const searchWrapper = document.querySelector(".g_search-wrapper");
  const searchCloseBg = document.querySelector(".g_search-close-bg");
  const searchInput = document.getElementById("g-search");
  const searchForumBtn = document.getElementById("search-forum-btn");
  const searchResultsContainer = document.querySelector(
    ".jetboost-list-wrapper-5j4q .cc_list-wrap"
  );

  let listItems = [];
  let activeIndex = -1;

  // Observer to monitor changes in search results
  const observer = new MutationObserver(() => {
    listItems = Array.from(
      searchResultsContainer.querySelectorAll("[role='listitem']")
    )
      .map((item) =>
        item.querySelector(".cc_list-item:not(.w-condition-invisible)")
      )
      .filter((item) => item !== null);
  });

  if (searchResultsContainer) {
    observer.observe(searchResultsContainer, { childList: true });
  }

  // Toggle search open & closed
  function toggleSearch() {
    searchWrapper.classList.toggle("active");
    document.documentElement.style.overflow = searchWrapper.classList.contains(
      "active"
    )
      ? "hidden"
      : "";
    if (searchWrapper.classList.contains("active")) {
      searchInput.focus();
    } else {
      clearActiveItem();
      activeIndex = -1;
    }
  }

  // Focus item functionality
  function focusItem(index) {
    if (activeIndex >= 0) {
      listItems[activeIndex].classList.remove("active");
      listItems[activeIndex].blur();
    }
    if (index === -1) {
      searchInput.focus();
      return;
    }
    activeIndex = index;
    listItems[activeIndex].classList.add("active");
    listItems[activeIndex].focus();
  }

  function clearActiveItem() {
    if (activeIndex >= 0) {
      listItems[activeIndex].classList.remove("active");
    }
  }

  // Keyboard event handling, including the new ArrowDown and ArrowUp
  document.addEventListener("keydown", function (event) {
    if (
      (event.key === "k" || event.key === "e") &&
      (event.ctrlKey || event.metaKey)
    ) {
      toggleSearch();
    } else if (event.key === "Escape") {
      searchWrapper.classList.remove("active");
      document.documentElement.style.overflow = "";
      searchInput.value = "";
      document.querySelector(".jetboost-list-search-reset-5j4q").click();
      clearActiveItem();
      activeIndex = -1;
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      // Only proceed if the searchResultsContainer is not hidden
      if (
        !document
          .querySelector(".jetboost-list-wrapper-5j4q")
          .classList.contains("jetboost-list-item-hide")
      ) {
        event.preventDefault();
        if (event.key === "ArrowDown") {
          focusItem(activeIndex < listItems.length - 1 ? activeIndex + 1 : 0);
        } else {
          focusItem(activeIndex > 0 ? activeIndex - 1 : -1);
        }
      }
    }
  });

  searchWrapper.addEventListener("click", function (event) {
    if (event.target === searchWrapper) {
      toggleSearch();
    }
  });

  document.querySelectorAll(".open-search").forEach((element) => {
    element.addEventListener("click", function () {
      toggleSearch();
    });
  });

  searchCloseBg.addEventListener("click", function () {
    searchWrapper.classList.remove("active");
    document.documentElement.style.overflow = "";
    searchInput.value = "";
    clearActiveItem();
    activeIndex = -1;
    document.querySelector(".jetboost-list-search-reset-5j4q").click();
  });

  // Reset activeIndex when search input gains focus
  searchInput.addEventListener("focus", function () {
    clearActiveItem();
    activeIndex = -1;
  });

  // NO RESULTS - - - - - - - - - - - - - - - - - - 👇
  const searchQuery = searchInput.value.trim() || getSearchQuery();

  function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("search-5j4q") || "";
  }

  function updateSearchQueryText(searchQuery) {
    const queryElement = document.getElementById("g-search-query-text");

    if (searchQuery && queryElement) {
      queryElement.textContent = decodeURIComponent(searchQuery);
    } else if (queryElement) {
      queryElement.textContent = decodeURIComponent(searchQuery);
    }
  }

  // Event listener for the search input to update the text content
  searchInput.addEventListener("input", () => {
    updateSearchQueryText(searchInput.value);
  });

  function redirectToForum() {
    // const searchQuery = searchInput.value || getSearchQuery();
    if (searchQuery) {
      const forumURL = "https://discourse.webflow.com/search?";
      window.location.href = `${forumURL}q=${searchQuery}`;
    }
  }

  searchForumBtn.addEventListener("click", redirectToForum);

  // Get the search query from the URL and update
  // both the search input and the display text
  if (searchQuery) {
    searchInput.value = decodeURIComponent(searchQuery);
    updateSearchQueryText(searchQuery);
  }
});
