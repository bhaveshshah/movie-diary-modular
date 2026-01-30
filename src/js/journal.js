
import { getFavouriteMovies } from "./utils/localstorage.js";
import { createFavMovieCard } from "./utils/ui.js";

/**
 * Initialize favourite movies section on DOM load.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", async () => {
  const favoriteMovies = getFavouriteMovies();

    favoriteMovies.forEach(movie => {
        createFavMovieCard(movie, 'favorite-movies-card-container');
    });

  if (favoriteMovies.length === 0) {
    const container = document.getElementById("favorite-movies-card-container");
    const message = document.createElement("p");
    message.textContent = "You have no favorite movies yet. Add some from the main page to see them here!";
    message.classList.add("text-center", "text-white", "mt-4");
    container.appendChild(message);
  }
});