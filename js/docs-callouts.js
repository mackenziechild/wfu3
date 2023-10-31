window.addEventListener("DOMContentLoaded", function () {
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
});