window.addEventListener("DOMContentLoaded", function () {
  // Selectors - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Select DOM elements for interaction.
  const pageTitle = document.getElementById("pageTitle");
  if (!pageTitle) {
    console.error("No pageTitle found");
    return;
  }
  const richTextHeadings = document.querySelectorAll(
    ".docs_rich-text > h2, .docs_rich-text > h3, .docs_rich-text > h4, .docs_rich-text > h5"
  );

  // const sectionHeadings = document.querySelectorAll(".docs_rich-text > h2");
  const allHeadings = [pageTitle].concat(Array.from(richTextHeadings));
  const tocDrawer = document.getElementById("docs_toc");

  // If there are no section headings, there is nothing to do.
  if (richTextHeadings.length === 0) {
    tocDrawer.style.display = "none";
    return;
  }

  if (!tocDrawer) {
    console.error("No table of contents drawer found");
    return;
  }

  // Utility functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Generate unique IDs based on the title text.
  const generateIdBasedOnTitle = (titletoconvert) => {
    return (
      titletoconvert
        // Converting the title to a suitable format for an id.
        .toLowerCase()
        .trim()
        // Remove unnecessary characters
        .replace(/['’"&]/g, "")
        .replace(/“([^”]+)”/, "$1")
        .replace(/\s*[:.,?—–\\/-]\s*/g, "-")
        .replace(/\s+/g, "-")
    );
  };

  // Copy anchor link to clipboard
  const copyAnchorToClipboard = (
    element,
    spanElement,
    mouseEnterTime = 750
  ) => {
    let hoverTimeout;
    let tooltip;
    // Mouseover event listener
    element.addEventListener("mouseenter", function (event) {
      clearTimeout(hoverTimeout);
      // Create tooltip here
      tooltip = document.createElement("span");
      addClass(tooltip, "tooltip");
      tooltip.innerText = `Copy anchor link`;
      this.appendChild(tooltip);
      // Show the tooltip after 1 second
      hoverTimeout = setTimeout(() => {
        addClass(tooltip, "active");
      }, mouseEnterTime);
    });

    // Mouseout event listener
    element.addEventListener("mouseleave", function () {
      // Hide the tooltip immediately
      clearTimeout(hoverTimeout);
      if (tooltip) {
        removeClass(tooltip, "active");
        this.removeChild(tooltip);
        tooltip = null;
      }
    });

    // Click event listener
    element.addEventListener("click", function (event) {
      event.preventDefault(); // prevent any default click behavior
      clearTimeout(hoverTimeout);

      if (spanElement && spanElement.classList.contains("anchor")) {
        const id = spanElement.id;

        if (tooltip) {
          tooltip.innerText = `Copied!`;
          addClass(tooltip, "active");

          // Create the URL by grabbing the window's href
          // removing the query param
          // and appending the ID of the selected anchor link
          const url = new URL(window.location.href);
          url.searchParams.delete("topic");
          const anchorLink = `${url.origin}${url.pathname}#${id}`;

          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(anchorLink).catch((err) => {
              console.error("Could not copy text: ", err);
            });
          }
          // Hide the tooltip after 2 seconds
          hoverTimeout = setTimeout(() => {
            removeClass(tooltip, "active");
          }, 1500);
        }
      } else {
        console.error("Couldn't find Span with the ID");
      }
    });
  };

  // Add a class to a DOM element.
  const addClass = (element, className) => {
    if (element && className) {
      if (Array.isArray(className)) {
        element.classList.add(...className);
      } else if (typeof className === "string") {
        element.classList.add(className);
      }
    }
  };

  // Remove a class from a DOM element.
  const removeClass = (element, className) => {
    if (element && className) {
      if (Array.isArray(className)) {
        element.classList.remove(...className);
      } else if (typeof className === "string") {
        element.classList.remove(className);
      }
    }
  };

  // Make a table of contents link active.
  const makeActive = (link) => {
    if (!tocLinks[link]) return;
    addClass(tocLinks[link], "active");
  };

  // Function to remove active status from a table of contents link.
  const removeActive = (link) => {
    if (!tocLinks[link]) return;
    removeClass(tocLinks[link], "active", "w--current");
  };

  // Remove active status from all table of contents links.
  const removeAllActive = () => {
    const sectionKeys = Array(allHeadings.length).keys();
    [...sectionKeys].forEach((link) => {
      removeActive(link);
    });
  };

  // TABLE OF CONTENTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Create a table of contents.
  const tocList = document.createElement("div");
  addClass(tocList, "docs_toc-links-wrap");

  // Loop through allHeadings and add an ID to each element
  allHeadings.forEach((title) => {
    // Generate an ID if the element doesn't already have one
    const id = title.id ? title.id : generateIdBasedOnTitle(title.textContent);

    // Create an span tag which will act as the anchor link
    let anchorSpan = document.createElement("span");
    anchorSpan.setAttribute("id", id);
    addClass(anchorSpan, "anchor");
    title.appendChild(anchorSpan);

    // If this is the first heading (with ID 'pageTitle'), set the span's ID to 'top'
    if (title.id === "pageTitle") {
      anchorSpan.id = "top";
    }

    // Create the copy to clipboard button
    let anchorLinkBox = document.createElement("a");
    addClass(anchorLinkBox, ["anchor_link_box", "u-bgc-lifted"]);
    // Define the Link Icon SVG
    const linkIcon = `
      <svg width="0.5em" height="0.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 13.25L18.25 12C19.9069 10.3431 19.9069 7.65684 18.25 5.99999C16.5931 4.34314 13.9069 4.34314 12.25 5.99999L11 7.24999" stroke-width="1.5" stroke="var(--text-primary)" stroke-linecap="square" stroke-linejoin="bevel"/>
        <path d="M7.50002 10.75L6.25002 12C4.59317 13.6569 4.59317 16.3431 6.25002 18C7.90687 19.6569 10.5931 19.6569 12.25 18L13.5 16.75" stroke-width="1.5" stroke="var(--text-primary)" stroke-linecap="square" stroke-linejoin="bevel"/>
        <path d="M14.5 9.75L10 14.25" stroke-width="1.5" stroke="var(--text-primary)" stroke-linecap="square" stroke-linejoin="bevel"/>
      </svg>
    `;
    // Set the link icon inside the anchorLinkBox
    anchorLinkBox.innerHTML = linkIcon;
    title.appendChild(anchorLinkBox);
    copyAnchorToClipboard(anchorLinkBox, anchorSpan);

    // If an h1 or h2 heading, add to the Table of Contents
    if (title.tagName === "H1" || title.tagName === "H2") {
      let a = document.createElement("a");
      addClass(a, "cc_toc-item");
      a.textContent = title.textContent;
      a.setAttribute("href", `#${anchorSpan.id}`);
      tocList.appendChild(a);
    }
  });

  tocDrawer.appendChild(tocList);

  // Fetch all links and visualization elements from the table of contents.
  const tocLinks = document.querySelectorAll(".docs_toc-links-wrap > a");

  // Make the first link and visualization active.
  if (tocLinks.length > 0) {
    addClass(tocLinks[0], "active");
  }

  // Variables for the scroll listener.
  const headingsOffset = -130;
  let currentActive = -1;
  let frameRequested = false;

  // Add a scroll listener to update the active section.
  window.addEventListener("scroll", () => {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(updateActiveSection);
    }
  });

  // Function to find the currently active section and update the table of contents.
  function updateActiveSection() {
    const filteredHeadings = [...allHeadings].filter(
      (heading) => heading.tagName === "H1" || heading.tagName === "H2"
    );
    const reversedSections = filteredHeadings.reverse();
    const index = reversedSections.findIndex((section) => {
      return window.scrollY >= section.offsetTop + headingsOffset;
    });
    const currentSection = filteredHeadings.length - index - 1;

    if (
      currentSection < allHeadings.length &&
      currentSection !== currentActive
    ) {
      removeAllActive();
      currentActive = currentSection;
      makeActive(currentSection);
    } else if (currentSection >= allHeadings.length) {
      removeAllActive();
      currentActive = currentSection;
    }

    frameRequested = false;
  }
});