window.addEventListener("DOMContentLoaded", function () {
  const simulateCookieFailure = false; // Change to false to turn off the simulation

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

  // Set the current domain for cookies
  let currentDomain =
    window.location.hostname === "wfu3.webflow.io"
      ? "wfu3.webflow.io"
      : ".webflow.com";

  // Test to see if cookies are enabled
  function checkCookieEnabled() {
    if (simulateCookieFailure) {
      return false;
    }

    // Try to set a test cookie
    document.cookie =
      "testcookie=1; expires=Wed, 01-Jan-2070 00:00:01 GMT; path=/";

    // Try to get the test cookie
    const isEnabled = document.cookie.indexOf("testcookie") !== -1;

    // Delete the test cookie
    document.cookie =
      "testcookie=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/";

    return isEnabled;
  }

  const isCookieEnabled = checkCookieEnabled();

  // Function to get the cookie or localStorage item
  const getStorage = (cookieKey, localStorageKey) =>
    Cookies.get(cookieKey) || localStorage.getItem(localStorageKey);

  // Function to set the cookie or localStorage item
  const setStorage = (cookieKey, localStorageKey, value) => {
    try {
      if (simulateCookieFailure) {
        throw new Error("Simulating cookie failure");
      }
      Cookies.set(cookieKey, value, {
        expires: 365,
        domain: currentDomain
      });
    } catch (e) {
      localStorage.setItem(localStorageKey, value);
    }
  };

  // Function to migrate existing localStorage item to cookies
  // But only if cookies are enabled
  const migrateToCookies = (cookieKey, localStorageKey) => {
    const localStorageItem = localStorage.getItem(localStorageKey);
    if (localStorageItem && isCookieEnabled) {
      setStorage(cookieKey, localStorageKey, localStorageItem);
      localStorage.removeItem(localStorageKey);
    }
  };

  // Call the migrate function on page load
  migrateToCookies("wfu-docs-fontSize", "selectedFontSize");
  migrateToCookies("wfu-docs-fontFamily", "fontClass");

  // Function to update the base size and active class
  const updateBaseSize = (buttonId) => {
    // Set the base size based on the clicked button's id
    docsWrapper.style.setProperty("--base-size", baseSizes[buttonId]);

    // Save the button id in storage
    setStorage("wfu-docs-fontSize", "selectedFontSize", buttonId);

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
    const storedFontSize = getStorage("wfu-docs-fontSize", "selectedFontSize");

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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // OPEN DYSLEXIC FONT FAMILY TOGGLE
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Get a reference to the checkbox
  const fontCheckbox = document.getElementById("fontCheckbox");
  const checkboxInput = fontCheckbox.previousElementSibling;

  // Function to toggle the class based on checkbox state
  const toggleFontClass = () => {
    if (fontCheckbox.checked) {
      docsWrapper.classList.add("font-alt");
      checkboxInput.classList.add("w--redirected-checked");
      setStorage("wfu-docs-fontFamily", "fontClass", "openDyslexic");
      localStorage.setItem("fontClass", "openDyslexic");
    } else {
      docsWrapper.classList.remove("font-alt");
      checkboxInput.classList.remove("w--redirected-checked");

      // Remove the cookie or localStorage item
      Cookies.remove("wfu-docs-fontFamily", { domain: currentDomain });
      localStorage.removeItem("fontClass");
    }
  };

  // Attach the toggle function to the change event for the checkbox
  fontCheckbox.addEventListener("change", function (e) {
    e.stopImmediatePropagation();
    toggleFontClass();
  });

  // Get saved class from storage when the page loads
  const savedFontClass = getStorage("wfu-docs-fontFamily", "fontClass");
  if (savedFontClass) {
    docsWrapper.classList.add("font-alt");
    checkboxInput.classList.add("w--redirected-checked");
    fontCheckbox.checked = true;
  }
});