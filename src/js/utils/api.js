const BASE_URL = "https://api.themoviedb.org";
const API_KEY = "API_KEY_HERE";
let debounceTimer; // for now, added here later would add to the specific place and pass this as a param.

async function fetchFromAPI(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams({
      ...params,
    });
    return await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
  } catch (e) {
    console.log(`Error fetching API data: ${e}`);
    throw e;
  }
}

export async function getMovieById(id) {
  try {
    const response = await fetchFromAPI(`/3/movie/${id}`, {
      api_key: API_KEY,
    });
    return await response.json();
  } catch (e) {
    console.log(`Error fetching a movie by id: ${e}`);
    throw e;
  }
}

export async function getAllMovies(year, page = 1) {
  try {
    const response = await fetchFromAPI("/3/discover/movie", {
      api_key: API_KEY,
      primary_release_year: year,
      page: page,
    });
    return await response.json();
  } catch (e) {
    console.log(`Error file fetching all movies: ${e}`);
    throw e;
  }
}

export async function getPopularOrLatestMovies(
  movieType = "popular" | "now_playing",
  page = 1,
) {
  try {
    const response = await fetchFromAPI("/3/movie/" + movieType, {
      api_key: API_KEY,
      page: page,
    });
    return await response.json();
  } catch (e) {
    console.log(`Error file fetching all movies: ${e}`);
    throw e;
  }
}

export async function searchMovies(name) {
  clearTimeout(debounceTimer);
  if (name) {
    return new Promise((resolve, reject) => {
      debounceTimer = setTimeout(async () => {
        try {
          const response = await fetchFromAPI("/3/search/movie", {
            api_key: API_KEY,
            query: name,
          });

          resolve(response.json());
        } catch (e) {
          console.log(`Error fetching search results: ${e}`);
          reject(e);
          throw e;
        }
      }, 1000);
    });
  }
}
