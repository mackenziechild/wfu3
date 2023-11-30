document.addEventListener("DOMContentLoaded", function () {
  const searchWrapper = document.querySelector(".g_search-wrapper");
  const searchCloseBg = document.querySelector(".g_search-close-bg");
  const searchInput = document.getElementById("g-search");

  // Toggle search open & closed
  function toggleSearch() {
    // Toggle the active class
    searchWrapper.classList.toggle("active");
    // Stop the body from scrolling
    document.documentElement.style.overflow = searchWrapper.classList.contains(
      "active",
    )
      ? "hidden"
      : "";

    if (searchWrapper.classList.contains("active")) {
      searchInput.focus();
    }
  }

  // Close the search modal
  const closeSearch = () => {
    setTimeout(() => {
      searchWrapper.classList.remove("active");
      document.documentElement.style.overflow = "";
      searchInput.value = "";
      const event = new Event("input", {
        bubbles: true,
        cancelable: true,
      });
      searchInput.dispatchEvent(event);
    }, 100);
  };

  // Keyboard event handling, including the new ArrowDown and ArrowUp
  document.addEventListener("keydown", function (event) {
    if (
      (event.key === "k" || event.key === "e") &&
      (event.ctrlKey || event.metaKey)
    ) {
      if (!searchWrapper.classList.contains("active")) {
        toggleSearch();
      }
    } else if (event.key === "Escape") {
      closeSearch();
    }
  });

  searchWrapper.addEventListener("click", function (event) {
    if (event.target === searchWrapper) {
      toggleSearch();
    }
  });

  // Find all .open-search
  document.querySelectorAll(".open-search").forEach((element) => {
    element.addEventListener("click", function () {
      toggleSearch();
    });
  });

  searchCloseBg.addEventListener("click", closeSearch);

  // MutationObserver to watch for the Swiftype elements
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    const stCloseBtn = document.querySelector(".st-ui-close-button");
    const stUiOverlay = document.querySelector(".st-ui-overlay");
    const autocompleteElement = document.querySelector(
      ".st-default-autocomplete .st-query-present",
    );

    if (stCloseBtn && stUiOverlay) {
      // Add event listener to the close button
      stCloseBtn.addEventListener("click", closeSearch);

      // Add event listener to the overlay
      stUiOverlay.addEventListener("click", closeSearch);
    }

    if (autocompleteElement) {
      // Adjust max height of the autocomplete element
      adjustMaxHeight();

      // Add resize listener for the autocomplete element
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", adjustMaxHeight);
      } else {
        window.addEventListener("resize", adjustMaxHeight);
      }
    }

    if (stCloseBtn && stUiOverlay && autocompleteElement) {
      // Once we have found the elements and added the event listeners, we don't need the observer anymore
      observer.disconnect();
    }
  };

  // Adjust height of the autocomplete container based
  // on viewport height, including mobile keyboard
  function adjustMaxHeight() {
    // Define different offsets for mobile and desktop
    const mobileOffset = 150; // Adjust this value as needed for mobile
    const desktopOffset = 220; // Adjust this value as needed for desktop

    // Use a width threshold to differentiate between mobile and desktop
    const mobileWidthThreshold = 768; // Common threshold for mobile devices

    // Determine the current viewport width
    const viewportWidth = window.innerWidth;

    // Choose the offset based on the viewport width
    const currentOffset =
      viewportWidth < mobileWidthThreshold ? mobileOffset : desktopOffset;

    // Calculate adjusted max height
    let viewportHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;
    const adjustedMaxHeight = viewportHeight - currentOffset;

    // Apply the adjusted max height
    const autocompleteElement = document.querySelector(
      ".st-default-autocomplete .st-query-present",
    );
    if (autocompleteElement) {
      autocompleteElement.style.maxHeight = adjustedMaxHeight + "px";
    }
  }

  // Create an instance of the observer with the callback function
  const observer = new MutationObserver(callback);

  // Select the node that will be observed for mutations
  const targetNode = document.body;

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
