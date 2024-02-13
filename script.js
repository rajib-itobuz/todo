const colors = ["#ccd5ae", "#faedcd", "#f5cac3", "#bde0fe", "#fcf6bd"];
const priorityColors = ["#ccd5ae", "#faedcd", "#f5cac3"];

const cards = document.querySelectorAll(".card");

cards.forEach((e) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  e.style.background = colors[randomIndex];
});
