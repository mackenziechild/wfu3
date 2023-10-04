document.addEventListener("DOMContentLoaded", function () {
  const toggleContrastButtons = document.querySelectorAll(".toggle-contrast");
  const toggleContrastCheckbox = document.getElementById(
    "toggleContrastCheckbox"
  );

  const setContrast = (contrast) => {
    document.documentElement.setAttribute("data-contrast", contrast);
    localStorage.setItem("contrast", contrast);

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
    const currentContrast = localStorage.getItem("contrast") || "default";
    const newContrast = currentContrast === "default" ? "high" : "default";
    setContrast(newContrast);
    // Update checkbox based on new contrast value
    if (toggleContrastCheckbox) {
      toggleContrastCheckbox.checked = newContrast === "high";
    }
  };

  const savedContrast = localStorage.getItem("contrast");
  if (savedContrast) {
    setContrast(savedContrast);
    // Set initial checkbox state based on saved contrast
    if (toggleContrastCheckbox) {
      toggleContrastCheckbox.checked = savedContrast === "high";
    }
  } else {
    setContrast("default");
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
