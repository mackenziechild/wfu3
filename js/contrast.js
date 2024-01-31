document.addEventListener("DOMContentLoaded", function () {
  // Reference the contrast toggle buttons
  const toggleContrastButtons = document.querySelectorAll(".toggle-contrast");
  const toggleContrastCheckbox = document.getElementById(
    "toggleContrastCheckbox"
  );

  // Set domain for cookies
  let currentDomain =
    window.location.hostname === "wfu3.webflow.io"
      ? "wfu3.webflow.io"
      : ".webflow.com";

  // Test to see if cookies are enabled
  function checkCookieEnabled() {
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

  // Function to get the current contrast
  const getContrastStorage = () =>
    Cookies.get("wfu-contrast") || localStorage.getItem("contrast");

  // Function to set the contrast
  const setContrastStorage = (value) => {
    try {
      Cookies.set("wfu-contrast", value, {
        expires: 365,
        domain: currentDomain
      });
    } catch (e) {
      localStorage.setItem("contrast", value);
    }
  };

  // Check if contrast is set in local storage
  // if true && cookies are enabled, swap it to use cookies instead
  const localStorageContrast = localStorage.getItem("contrast");
  if (localStorageContrast && isCookieEnabled) {
    setContrastStorage(localStorageContrast);
    localStorage.removeItem("contrast");
  }

  const setContrast = (contrast) => {
    document.documentElement.setAttribute("data-contrast", contrast);
    setContrastStorage(contrast);

    if (!toggleContrastCheckbox) return;
    const checkboxInput = toggleContrastCheckbox.previousElementSibling;

    if (contrast === "high") {
      checkboxInput.classList.add(
        "w--redirected-checked",
        "w--redirected-focus"
      );
    } else {
      checkboxInput.classList.remove(
        "w--redirected-checked",
        "w--redirected-focus"
      );
    }
  };

  const toggleContrast = () => {
    const currentContrast = getContrastStorage() || "default";
    // Change contrast to the opposite of current
    const newContrast = currentContrast === "default" ? "high" : "default";
    setContrast(newContrast);

    // Update checkbox based on new contrast value
    if (toggleContrastCheckbox) {
      toggleContrastCheckbox.checked = newContrast === "high";
    }
  };

  // Intialize
  const savedContrast = getContrastStorage() || "default";
  setContrast(savedContrast);

  if (toggleContrastCheckbox) {
    toggleContrastCheckbox.checked = savedContrast === "high";
  }

  toggleContrastButtons.forEach((button) => {
    button.addEventListener("click", toggleContrast);
  });

  // Event listener for the checkbox
  if (toggleContrastCheckbox) {
    toggleContrastCheckbox.addEventListener("change", function (e) {
      // Stop any other event listeners from being called
      e.stopImmediatePropagation();

      const contrast = e.target.checked ? "high" : "default";
      setContrast(contrast);
    });
  }
});
