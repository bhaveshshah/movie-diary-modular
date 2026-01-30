import { debounce } from "./utils";
const BASE_URL = "https://api.themoviedb.org";
const API_KEY = process.env.TMDB_API_KEY;

class APIError extends Error {
  constructor(message, statusCode, endpoint) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

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
        throw new ApiError(
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

export async function getMovieById(id) {
  if (!id) {
    throw new APIError("Movie ID is required", 400, "/movie/:id");
  }

  return fetchFromAPI(`/3/movie/${id}`);
}

export async function getAllMovies(year, page = 1) {
  if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
    throw new APIError(`Valid year is required`, 400, "/movie/:year");
  }

  return fetchFromAPI("/3/discover/movie", {
    primary_release_year: year,
    page: Math.max(1, Math.floor(page)),
  });
}

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

async function searchMoviesImmediate(query) {
  if (!query) {
  }
  return fetchFromAPI("/3/search/movie", { query });
}

export const searchMoviesWithDebounce = debounce(searchMoviesImmediate, 1000);
