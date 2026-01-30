
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
});