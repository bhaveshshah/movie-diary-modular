/**
 * Key used to store favourite movies in localStorage.
 * @type {string}
 */
export const FAVOURITE_KEY = "favourite";

/**
 * Retrieve JSON data from localStorage.
 * @param {string} key - The storage key to read.
 * @returns {Array} Parsed data array, or an empty array on error/empty.
 */
export function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(`Error getting the data from localStorage: ${error}`);
    return [];
  }
}

/**
 * Store JSON-serializable data in localStorage.
 * @param {string} key - The storage key to write.
 * @param {unknown} data - The data to serialize and store.
 * @returns {void}
 */
export function setData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(`Error storing the data in localStorage: ${error}`);
  }
}

/**
 * Toggle a movie in the favourites list.
 * @param {Object} movie - The movie to toggle.
 * @param {number} movie.id - The movie id.
 * @param {string} [movie.title] - The movie title.
 * @param {string} [movie.poster_path] - The poster path.
 * @param {string} [movie.overview] - The movie overview.
 * @param {number} [movie.popularity] - The popularity score.
 * @param {string} [movie.name] - Alternative movie name.
 * @returns {void}
 */
export function toggleFavoriteMovie(movie) {
  const favouriteMovies = getData(FAVOURITE_KEY);

  const index = favouriteMovies.findIndex((fav) => fav.id === movie.id);

  if (index !== -1) {
    favouriteMovies.splice(index, 1);
  } else {
    favouriteMovies.push({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      popularity: movie.popularity,
      name: movie.name,
    });
  }

  setData(FAVOURITE_KEY, favouriteMovies);
}

/**
 * Check if a movie is in favourites.
 * @param {number} id - The movie id.
 * @returns {boolean} True if the movie is favourited.
 */
export function isFavourite(id) {
  return getData(FAVOURITE_KEY).some((fav) => fav.id === id);
}

/**
 * Get all favourite movies.
 * @returns {Array} Array of favourite movie objects.
 */
export function getFavouriteMovies() {
  return getData(FAVOURITE_KEY); // returns array of favourite IDs
}
