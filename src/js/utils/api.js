import { debounce } from "./utils";
const BASE_URL = "https://api.themoviedb.org";
const API_KEY = process.env.TMDB_API_KEY;

/**
 * Class representing an error from the API.
 * @extends Error
 */
class APIError extends Error {
  /**
   * Create an APIError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   * @param {string} endpoint - The API endpoint that caused the error.
   */
  constructor(message, statusCode, endpoint) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

/**
 * Fetch data from the API.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {Object} [params={}] - The query parameters to include in the request.
 * @param {number} [retries=3] - The number of retry attempts for the request.
 * @returns {Promise<Object>} The JSON response from the API.
 * @throws {APIError} If the request fails or the response is not ok.
 */
async function fetchFromAPI(endpoint, params = {}, retries = 3) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  for (let attempt = 0; attempt <= retries; attemp++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(
          `HTTP: ${response.status}: ${response.statusText}`,
          response.status,
          endpoint,
        );
      }

      return await response.json();
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      const shouldRetry =
        error.name === "AbortError" ||
        error.message.includes("fetch") ||
        (error instanceof APIError && error.statusCode >= 500);

      if (!shouldRetry || isLastAttempt) {
        throw error instanceof APIError
          ? error
          : new APIError(`Network error: ${error.message}`, 0, endpoint);
      }

      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
    }
  }
}

/**
 * Get a movie by its ID.
 * @param {number} id - The ID of the movie to retrieve.
 * @returns {Promise<Object>} The movie data.
 * @throws {APIError} If the movie ID is not provided or the request fails.
 */
export async function getMovieById(id) {
  if (!id) {
    throw new APIError("Movie ID is required", 400, "/movie/:id");
  }

  return fetchFromAPI(`/3/movie/${id}`);
}

/**
 * Get all movies released in a specific year.
 * @param {number} year - The year to filter movies by.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<Object>} The list of movies for the specified year.
 * @throws {APIError} If the year is invalid or the request fails.
 */
export async function getAllMovies(year, page = 1) {
  if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
    throw new APIError(`Valid year is required`, 400, "/movie/:year");
  }

  return fetchFromAPI("/3/discover/movie", {
    primary_release_year: year,
    page: Math.max(1, Math.floor(page)),
  });
}

/**
 * Get popular or latest movies.
 * @param {string} [movieType="popular"] - The type of movies to retrieve.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<Object>} The list of movies based on the specified type.
 * @throws {APIError} If the movie type is invalid or the request fails.
 */
export async function getPopularOrLatestMovies(
  movieType = "popular",
  page = 1,
) {
  const validTypes = ["popular", "now_playing", "latest"];
  if (!validTypes.includes(movieType)) {
    throw new APIError(
      `Invalid movie type. Must be one of: ${validTypes.join(", ")}`,
      400,
      `/movie/${movieType}`,
    );
  }

  return fetchFromAPI(`/3/movie/${movieType}`, { page });
}

/**
 * Search for movies immediately based on a query.
 * @param {string} query - The search query for movies.
 * @returns {Promise<Object>} The list of movies matching the search query.
 * @throws {APIError} If the query is not provided or the request fails.
 */
async function searchMoviesImmediate(query) {
  if (!query) {
  }
  return fetchFromAPI("/3/search/movie", { query });
}

/**
 * Search for movies with a debounce effect.
 * @type {function}
 */
export const searchMoviesWithDebounce = debounce(searchMoviesImmediate, 1000);
