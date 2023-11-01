document.addEventListener("DOMContentLoaded", function () {
  // Reference to the desktop theme buttons
  const toLightModeButton = document.getElementById("toLightMode");
  const toDarkModeButton = document.getElementById("toDarkMode");

  // Reference to the mobile theme buttons
  const toLightModeButtonMobile = document.getElementById("toLightModeMobile");
  const toDarkModeButtonMobile = document.getElementById("toDarkModeMobile");

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

  // Function to get the current theme
  const getThemeStorage = () =>
    Cookies.get("wfu-theme") || localStorage.getItem("theme");

  // Function to set the theme
  const setThemeStorage = (value) => {
    try {
      Cookies.set("wfu-theme", value, {
        expires: 365,
        domain: currentDomain
      });
    } catch (e) {
      localStorage.setItem("theme", value);
    }
  };

  // Check if Theme is set in local storage
  // if true && cookies are enabled, swap it to use cookies instead
  const localStorageTheme = localStorage.getItem("theme");
  if (localStorageTheme && isCookieEnabled) {
    setThemeStorage(localStorageTheme);
    localStorage.removeItem("theme"); // Remove from local storage
  }

  const updateButtons = (theme) => {
    const screenWidth = window.innerWidth;

    // For desktop
    if (screenWidth > 768) {
      if (theme === "light") {
        toDarkModeButton.style.display = "flex";
        toDarkModeButtonMobile.style.display = "flex";
        toLightModeButton.style.display = "none";
        toLightModeButtonMobile.style.display = "none";
      } else {
        toDarkModeButton.style.display = "none";
        toDarkModeButtonMobile.style.display = "none";
        toLightModeButton.style.display = "flex";
        toLightModeButtonMobile.style.display = "flex";
      }
    }
    // For mobile
    else {
      if (theme === "light") {
        toDarkModeButtonMobile.style.display = "flex";
        toLightModeButtonMobile.style.display = "none";
      } else {
        toDarkModeButtonMobile.style.display = "none";
        toLightModeButtonMobile.style.display = "flex";
      }
      toDarkModeButton.style.display = "none";
      toLightModeButton.style.display = "none";
    }
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    setThemeStorage(theme);
    updateButtons(theme);
  };

  // Function to handle theme click events
  const handleThemeClick = (element, theme) => {
    element.addEventListener("click", () => {
      setTimeout(() => {
        setTheme(theme);
      }, 380);
    });
  };

  const attachListeners = () => {
    handleThemeClick(toLightModeButton, "light");
    handleThemeClick(toDarkModeButton, "dark");
    handleThemeClick(toLightModeButtonMobile, "light");
    handleThemeClick(toDarkModeButtonMobile, "dark");
  };

  // Initialize
  setTheme(getThemeStorage() || "dark");
  attachListeners();

  // Listen for resize changes & update buttons accordingly
  window.addEventListener("resize", () => {
    const currentTheme = getThemeStorage() || "dark";
    updateButtons(currentTheme);
  });
});