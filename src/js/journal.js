
import { getFavouriteMovies } from "./utils/localstorage.js";
import { createFavMovieCard } from "./utils/ui.js";

// Initialize favorite movies section on DOM load

document.addEventListener("DOMContentLoaded", async () => {
  const favoriteMovies = getFavouriteMovies();

    favoriteMovies.forEach(movie => {
        createFavMovieCard(movie, 'favorite-movies-card-container');
    });
});