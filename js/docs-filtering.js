document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("docs-search");
  const forumBtn = document.getElementById("forum-btn");
  const resetBtn = document.getElementById("reset-btn");
  const docsListWrapper = document.getElementById("docs-list-wrap");

  function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("search-8vp8") || "";
  }

  function updateSearchQueryText(searchQuery) {
    const queryElement = document.querySelector(".jetboost-search-query");
    if (queryElement) {
      queryElement.textContent = decodeURIComponent(searchQuery);
    }
  }

  function updateEmptyStateMessage() {
    const searchQuery = searchInput.value.trim();
    const messageElement = document.querySelector(
      ".cc_docs-list-no-results-title"
    );
    if (messageElement) {
      if (searchQuery) {
        messageElement.textContent = `Hmm…we couldn’t find any results for “${searchQuery}”. Try a different search term or search on our community forum.`;
      } else {
        messageElement.textContent =
          "Hmm…we couldn’t find any results. Reset the filters or try searching for something specific.";
      }
    }
  }

  function updateButtonVisibility() {
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
      forumBtn.style.display = "block";
      resetBtn.style.display = "none";
    } else {
      forumBtn.style.display = "none";
      resetBtn.style.display = "block";
    }
  }

  // Function to update the border based on the child elements
  function updateBorder() {
    if (docsListWrapper.children.length > 0) {
      docsListWrapper.style.borderStyle = "solid";
      docsListWrapper.lastElementChild.style.borderBottomStyle = "none";
    } else {
      docsListWrapper.style.borderStyle = "none";
    }
  }

  function updateLastItemBorder() {
    const items = docsListWrapper.querySelectorAll(".cc_list-item");
    items.forEach((item, index) => {
      if (index === items.length - 1) {
        item.style.borderBottomStyle = "none";
      } else {
        item.style.borderBottomStyle = "solid";
      }
    });
  }

  function redirectToForum() {
    const searchQuery = searchInput.value || getSearchQuery();
    if (searchQuery) {
      const forumURL = "https://discourse.webflow.com/search?";
      window.location.href = `${forumURL}q=${searchQuery}`;
    }
  }

  // Event listener for the search input to update the text content
  searchInput.addEventListener("input", () => {
    updateSearchQueryText(searchInput.value);
    updateEmptyStateMessage();
    updateButtonVisibility();
  });

  forumBtn.addEventListener("click", redirectToForum);

  const resetFilters = document.querySelectorAll(
    ".cc_docs-filter-reset, #reset-btn"
  );

  resetFilters.forEach((resetFilter) => {
    resetFilter.addEventListener("click", () => {
      searchInput.value = "";
      updateEmptyStateMessage();
      updateButtonVisibility();
    });
  });

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(() => {
    updateBorder();
    updateLastItemBorder();
  });

  // Start observing the target node for child list changes
  observer.observe(docsListWrapper, { childList: true, subtree: true });

  // Call updateBorder initially in case the target element is not empty at the start
  updateBorder();
  // Call updateLastItemBorder intially to set the correct border on the last item
  updateLastItemBorder();

  // Get the search query from the URL and update both the search input and the display text
  const searchQuery = getSearchQuery();
  if (searchQuery) {
    searchInput.value = decodeURIComponent(searchQuery);
    updateSearchQueryText(searchQuery);
  }

  updateEmptyStateMessage();
  updateButtonVisibility();

  // Back to top
  const backToTopButton = document.getElementById("backToTop");

  // Function to add/remove a class based on scroll position
  function toggleBackToTopButton() {
    if (window.scrollY > 500) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }

  // Function to append the docTopic to the URL
  function appendTopicToURL() {
    const docTopicElement = document.getElementById("docTopic");
    const docTopic = docTopicElement
      ? docTopicElement.getAttribute("data-topic")
      : null;

    if (!docTopic) return;

    // Convert to lowercase, replace spaces with hyphens, and ampersands with nothing
    const urlFriendlyTopic = docTopic
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // Get the current fragment identifier if it exists
    const currentFragment = window.location.hash;

    // Construct the URL with the appended query
    const urlWithTopic =
      window.location.origin +
      window.location.pathname +
      "?topics=" +
      urlFriendlyTopic +
      currentFragment;

    // Redirect to the new URL or update the browser's address bar as needed
    window.history.pushState({}, "", urlWithTopic);
  }

  // Call the appendTopicToURL function after the page loads
  appendTopicToURL();

  // Listen for the scroll event
  window.addEventListener("scroll", toggleBackToTopButton);

  // Listen for a click on the button and scroll to the top of the page
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
