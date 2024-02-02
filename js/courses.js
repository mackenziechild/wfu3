document.addEventListener("DOMContentLoaded", function () {
  const setupGridToggle = () => {
    const cardsButton = document.getElementById("cardBtn");
    const listButton = document.getElementById("listBtn");
    const coursesGrid = document.querySelector(".cc_courses-grid");

    if (!cardsButton || !listButton) {
      console.error("No cardButton or listButton found");
      return;
    }

    const updateGridClass = (listView, activeButton) => {
      if (listView) {
        coursesGrid.classList.add("list");
        localStorage.setItem("courseGridView", "list");
      } else {
        coursesGrid.classList.remove("list");
        localStorage.setItem("courseGridView", "cards");
      }

      cardsButton.classList.remove("active");
      listButton.classList.remove("active");
      activeButton.classList.add("active");
    };

    cardsButton.addEventListener("click", () =>
      updateGridClass(false, cardsButton)
    );
    listButton.addEventListener("click", () =>
      updateGridClass(true, listButton)
    );

    // Get the saved preference
    const savedPreference = localStorage.getItem("courseGridView");

    if (savedPreference === "list") {
      updateGridClass(true, listButton);
    } else {
      // Default to cards view if no preference is saved
      updateGridClass(false, cardsButton);
    }
  };

  const coursesGrid = document.querySelector(".cc_courses-grid");

  const updateCardStyling = () => {
    const courseCards = document.querySelectorAll(".cc_course-card");

    // Reset any existing styles first
    courseCards.forEach((card) => {
      card.style.borderRadius = "";
      card.style.borderBottom = "";
    });

    // If only one card, apply rounded corners all around
    if (courseCards.length === 1) {
      courseCards[0].style.borderRadius = "0.25rem";
      courseCards[0].style.borderBottom = "1px solid var(--theme--t_border-primary)";
      return;
    }

    // If multiple cards, apply styling to the first and last
    if (courseCards.length > 1) {
      courseCards[0].style.borderRadius = "0.25rem 0.25rem 0 0";
      courseCards[courseCards.length - 1].style.borderRadius =
        "0 0 0.25rem 0.25rem";
      courseCards[courseCards.length - 1].style.borderBottom =
        "1px solid var(--theme--t_border-primary)";
    }
  };

  const observer = new MutationObserver(updateCardStyling);

  observer.observe(coursesGrid, {
    childList: true,
    subtree: true
  });

  updateCardStyling();
  setupGridToggle();
});
