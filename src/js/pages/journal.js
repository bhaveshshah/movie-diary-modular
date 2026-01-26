/// Function for the slider arrows
import { getFavouriteMovies } from "../../script/localstorage.js";
import { createMovieCard } from "../../script/ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  const favoriteMovies = getFavouriteMovies();

  favoriteMovies.forEach((movie) => {
    createMovieCard(movie, "favorite-movies-card-container");
  });

  const favSection = document.getElementById("favorite-movies-block");
  setupSlider(favSection);
});

function setupSlider(section, minItems = 6) {
  const container = section.querySelector(".overflow-x-auto");
  const prevBtn = section.querySelector(".prev-btn");
  const nextBtn = section.querySelector(".next-btn");

  if (!container || !prevBtn || !nextBtn) return;

  const itemsCount = container.children.length;

  // Disable slider if fewer than minItems
  if (itemsCount < minItems) {
    container.classList.remove("overflow-x-auto");
    container.classList.add("justify-center");
    prevBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    container.scrollLeft = 0;
    return;
  }

  // Enable slider
  const scrollAmount = container.clientWidth * 0.8;

  nextBtn.addEventListener("click", () => {
    container.scrollLeft += scrollAmount;
  });

  prevBtn.addEventListener("click", () => {
    container.scrollLeft -= scrollAmount;
  });
}
