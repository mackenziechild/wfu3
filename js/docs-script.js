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
          const anchorLink =
            window.location.href.replace(window.location.hash, "") + "#" + id;
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
    // const id = title.id
    //   ? title.id
    //   : generateIdBasedOnTitle(title.textContent.slice(0, 36));
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

  // CALLOUTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function addCallout(elements) {
    // Define the SVG Icons
    const icons = {
      "Pro tip": `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.25 10C17.25 12.8995 14.8995 15.25 12 15.25C9.10051 15.25 6.75 12.8995 6.75 10C6.75 7.10051 9.10051 4.75 12 4.75C14.8995 4.75 17.25 7.10051 17.25 10Z" stroke-width="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.6796 9.99999H12V6.40736C14.0033 6.40736 15.6328 8.00789 15.6796 9.99999Z" fill="currentColor"/>
          <path d="M8.75 14.75L7.75 19.25L12 17.75L16.25 19.25L15.25 14.75" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
        </svg>
      `,
      Important: `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9936 8.11424V13.0438" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M12 3.31047C14.9463 6.25677 17.8925 9.20305 20.8388 12.1493L12 20.9881C9.05372 18.0419 6.10744 15.0956 3.16117 12.1493L12 3.31047Z" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <circle cx="12.0153" cy="16.016" r="0.741592" fill="currentColor"/>
        </svg>
      `,
      "Good to know": `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.75 4.74998C9.58333 4.75005 14.4167 4.75005 19.25 4.74998V16.25C17.7083 16.25 16.1667 16.25 14.625 16.25L12 19.25L9.375 16.25C7.83333 16.25 6.29167 16.25 4.75 16.25V4.74998Z" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <rect x="6.62805" y="6.76761" width="8.06042" height="2.14267" fill="currentColor"/>
          <rect x="6.62805" y="10.0355" width="5.24588" height="2.14267" fill="currentColor"/>
        </svg>
      `,
      "Learn more": `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.75001L10 4.75001C8.25001 4.75001 6.50001 4.74999 4.75 4.75001L4.75002 17.25C5.94773 17.25 8.34317 17.25 8.34317 17.25L12 19.25M12 6.75001V19.25M12 6.75001L14 4.75001C15.75 4.75001 17.5 4.74999 19.2501 4.75001L19.25 17.25C18.0523 17.25 15.6569 17.25 15.6569 17.25L12 19.25" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M14.9449 6.10622L17.8641 6.10622V9.83382H13.4794V7.59382L14.9449 6.10622Z" fill="currentColor"/>
        </svg>
      `,
      Warning: `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25Z" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M12 16.3251C14.3886 16.3251 16.325 14.3887 16.325 12C16.325 9.61134 14.3886 7.67494 12 7.67494C9.61132 7.67494 7.67493 9.61134 7.67493 12C7.67493 14.3887 9.61132 16.3251 12 16.3251Z" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M7 17L8.82888 15.1711" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M17 17L15.1711 15.1711" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M8.82888 8.82888L7 7" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
          <path d="M15.1972 8.80278L17 7" stroke-width="1.5" stroke="currentColor" stroke-linecap="square" stroke-linejoin="bevel"/>
        </svg>
      `,
      Note: `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.75 19.25C10.75 19.25 7.75 19.25 4.75 19.25L4.75 4.75C9.58333 4.75001 14.4167 4.75001 19.25 4.75V13.75M13.75 19.25L19.25 13.75Z" stroke-linecap="round" stroke-linejoin="bevel" stroke="currentColor" />
        </svg>
      `
    };

    function createTitleElement(title) {
      const titleEl = document.createElement("p");
      titleEl.innerText = title;
      return titleEl;
    }

    function createInnerDiv(titleEl, title, element) {
      // Create a figcaption element
      const innerDiv = document.createElement("figcaption");
      innerDiv.className = "docs_callout--header";
      // Create an anchor box for copy to clipboard
      // Insert icon & append to innerDiv
      let anchorLinkClickBox = document.createElement("a");
      addClass(anchorLinkClickBox, "docs_callout--click");
      anchorLinkClickBox.innerHTML = icons[title] || icons["Note"];
      innerDiv.appendChild(anchorLinkClickBox);
      // Append the title
      innerDiv.appendChild(titleEl);

      // Generate an ID based on the elements text
      // Create a span element for the anchor link
      // Append the span inside the innerDiv
      const id = generateIdBasedOnTitle(element.textContent.slice(0, 36));
      const anchorSpan = document.createElement("span");
      anchorSpan.setAttribute("id", id);
      addClass(anchorSpan, "anchor");
      innerDiv.prepend(anchorSpan);

      // Copy to clipboard
      copyAnchorToClipboard(anchorLinkClickBox, anchorSpan, 1500);

      return innerDiv;
    }

    function createOuterDiv(innerDiv, title) {
      const outerDiv = document.createElement("figure");
      const titleToClass = {
        "Pro tip": "pro-tip",
        Important: "important",
        "Good to know": "good-to-know",
        "Learn more": "learn-more",
        Warning: "warning"
      };
      let className = "docs_callout";
      if (titleToClass[title]) {
        className += ` ${titleToClass[title]}`;
      }
      outerDiv.className = className;
      outerDiv.appendChild(innerDiv);
      return outerDiv;
    }

    function convertElementToParagraph(element) {
      const newElement = document.createElement("p");
      addClass(newElement, "docs_callout-text");
      Array.from(element.attributes).forEach((attr) => {
        newElement.setAttribute(attr.name, attr.value);
      });
      while (element.firstChild) {
        newElement.appendChild(element.firstChild);
      }
      return newElement;
    }

    function moveElements(oldElement, newElement, outerDiv) {
      if (oldElement && oldElement.parentNode && outerDiv) {
        oldElement.parentNode.insertBefore(outerDiv, oldElement);
        oldElement.parentNode.removeChild(oldElement);
        outerDiv.appendChild(newElement);
      }
    }

    elements.forEach((element) => {
      const regex = /^<strong(?:\s+id="[^"]*")?>([^:]+):\s*<\/strong>([\s\S]*)/;
      const elementHTML = element.innerHTML;
      const newElHTML = elementHTML.match(regex);

      let title;
      if (newElHTML) {
        title = newElHTML[1];
        element.innerHTML = newElHTML[2];
      } else {
        title = "Note";
      }

      const titleEl = createTitleElement(title);
      const innerDiv = createInnerDiv(titleEl, title, element);
      const outerDiv = createOuterDiv(innerDiv, title);
      const paragraphElement = convertElementToParagraph(element);

      if (element && paragraphElement && outerDiv) {
        moveElements(element, paragraphElement, outerDiv);
      }
    });
  }

  // Select all h6 & blockquotes elements within the element with id 'doc_wrapper'
  const calloutElements = document.querySelectorAll(
    "#doc_wrapper h6, #doc_wrapper blockquote"
  );

  addCallout(calloutElements);
  console.log(addCallout(calloutElements));

  // FONT SIZE BUTTONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Get a reference to the buttons
  const smallFontButton = document.getElementById("fsSmall");
  const defaultFontButton = document.getElementById("fsDefault");
  const largeFontButton = document.getElementById("fsLarge");
  const xLargeFontButton = document.getElementById("fsXL");
  const docsWrapper = document.getElementById("doc_wrapper");

  // Array of all buttons
  const allButtons = [
    smallFontButton,
    defaultFontButton,
    largeFontButton,
    xLargeFontButton
  ];

  // Define a map from button id to base size
  const baseSizes = {
    fsSmall: "0.8rem",
    fsDefault: "1rem",
    fsLarge: "1.2rem",
    fsXL: "1.4rem"
  };

  // Function to update the base size and active class
  const updateBaseSize = (buttonId) => {
    // Set the base size based on the clicked button's id
    docsWrapper.style.setProperty("--base-size", baseSizes[buttonId]);

    // Save the button id in localStorage
    localStorage.setItem("selectedFontSize", buttonId);

    // Remove 'active' class from all buttons
    allButtons.forEach((button) => {
      button.classList.remove("active");
    });

    // Add 'active' class to the clicked button
    document.getElementById(buttonId).classList.add("active");
  };

  // Function to set the font size on page load based on stored value
  const setFontSizeOnLoad = () => {
    // Get the stored font size button id
    const storedFontSize = localStorage.getItem("selectedFontSize");

    // If there's a stored value, use it; otherwise, use the default
    const fontSize = storedFontSize || "fsDefault";

    updateBaseSize(fontSize);
  };

  // Call the function to set the font size on page load
  setFontSizeOnLoad();

  // Attach the update function to the click event for each button
  smallFontButton.addEventListener("click", () => updateBaseSize("fsSmall"));
  defaultFontButton.addEventListener("click", () =>
    updateBaseSize("fsDefault")
  );
  largeFontButton.addEventListener("click", () => updateBaseSize("fsLarge"));
  xLargeFontButton.addEventListener("click", () => updateBaseSize("fsXL"));

  // OPEN DYSLEXIC FONT TOGGLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Get a reference to the checkbox
  const fontCheckbox = document.getElementById("fontCheckbox");
  const checkboxInput = fontCheckbox.previousElementSibling;

  // Function to toggle the class based on checkbox state
  const toggleFontClass = () => {
    if (fontCheckbox.checked) {
      docsWrapper.classList.add("font-alt");
      checkboxInput.classList.add("w--redirected-checked");
      localStorage.setItem("fontClass", "font-alt");
    } else {
      docsWrapper.classList.remove("font-alt");
      checkboxInput.classList.remove("w--redirected-checked");
      localStorage.removeItem("fontClass");
    }
  };

  // Attach the toggle function to the change event for the checkbox
  fontCheckbox.addEventListener("change", function (e) {
    e.stopImmediatePropagation();
    toggleFontClass();
  });

  // Get saved class from localStorage when the page loads
  const savedFontClass = localStorage.getItem("fontClass");
  if (savedFontClass) {
    docsWrapper.classList.add(savedFontClass);
    checkboxInput.classList.add("w--redirected-checked");
    fontCheckbox.checked = true;
  }
});
