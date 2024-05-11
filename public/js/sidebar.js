const shrink_btn = document.querySelector(".shrink-btn");
const sidebar_links = document.querySelectorAll(".sidebar-links a");
const active_tab = document.querySelector(".active-tab");
const tooltip_elements = document.querySelectorAll(".tooltip-element");

let activeIndex;

shrink_btn.addEventListener("click", () => {
  document.body.classList.toggle("shrink");
  setTimeout(moveActiveTab, 400);

  shrink_btn.classList.add("hovered");

  setTimeout(() => {
    shrink_btn.classList.remove("hovered");
  }, 500);
});

function moveActiveTab() {
  let topPosition = activeIndex * 58 + 2.5;

  const shortcuts = document.querySelector(".sidebar-links h4");
  if (shortcuts) {
    topPosition += shortcuts.clientHeight;
  }

  active_tab.style.top = `${topPosition}px`;
}


function changeLink() {
  // Remove active class from all sidebar links
  sidebar_links.forEach((sideLink) => sideLink.classList.remove("active"));
  
  // Add active class to the clicked sidebar link
  this.classList.add("active");

  // Update the activeIndex based on the clicked link's data-active attribute
  activeIndex = this.dataset.active;

  moveActiveTab();
}

// Iterate over each sidebar link and add a click event listener
sidebar_links.forEach((link) => link.addEventListener("click", changeLink));

function showTooltip() {
  let tooltip = this.parentNode.lastElementChild;
  let spans = tooltip.children;
  let tooltipIndex = this.dataset.tooltip;

  Array.from(spans).forEach((sp) => sp.classList.remove("show"));
  spans[tooltipIndex].classList.add("show");

  tooltip.style.top = `${(100 / (spans.length * 2)) * (tooltipIndex * 2 + 1)}%`;
}

tooltip_elements.forEach((elem) => {
  elem.addEventListener("mouseover", showTooltip);
});


// Set active link based on current URL
const currentPath = window.location.pathname;
console.log("Current Path:", currentPath);

let foundActive = false;
sidebar_links.forEach((link) => {
  const href = link.getAttribute("href");
  console.log("Link Href:", href);
  if (currentPath === href) {
    link.classList.add("active");
    activeIndex = link.dataset.active;
    moveActiveTab();
    foundActive = true;
  } else {
    link.classList.remove("active");
  }
});

// If no link matches the current URL, set the first link as active
if (!foundActive && sidebar_links.length > 0) {
  sidebar_links[0].classList.add("active");
  activeIndex = sidebar_links[0].dataset.active;
  moveActiveTab();
}


