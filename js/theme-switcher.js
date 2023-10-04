document.addEventListener("DOMContentLoaded", function () {
  // Reference to the desktop theme buttons
  const toLightModeButton = document.getElementById("toLightMode");
  const toDarkModeButton = document.getElementById("toDarkMode");

  // Reference to the mobile theme buttons
  const toLightModeButtonMobile = document.getElementById("toLightModeMobile");
  const toDarkModeButtonMobile = document.getElementById("toDarkModeMobile");

  const setTheme = (theme) => {
    const screenWidth = window.innerWidth;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

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

  const attachListeners = () => {
    toLightModeButton.addEventListener("click", () => {
      setTimeout(() => {
        setTheme("light");
      }, 380);
    });

    toDarkModeButton.addEventListener("click", () => {
      setTimeout(() => {
        setTheme("dark");
      }, 380);
    });

    toLightModeButtonMobile.addEventListener("click", () => {
      setTimeout(() => {
        setTheme("light");
      }, 380);
    });

    toDarkModeButtonMobile.addEventListener("click", () => {
      setTimeout(() => {
        setTheme("dark");
      }, 380);
    });
  };

  // Initialize theme and add event listeners based on initial viewport
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
  attachListeners();

  // Re-attach appropriate event listeners on resize
  window.addEventListener("resize", () => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    setTheme(currentTheme);
  });
});
