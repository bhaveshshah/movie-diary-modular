import {
  getAllMovies,
  getMovieById,
  getPopularOrLatestMovies,
  searchMoviesWithDebounce,
} from "./utils/api.js";
import { createMovieCard } from "./utils/ui.js";

/**
 * Movie sections and their fetch configuration.
 * @type {{blockId: string, fetchFunction: () => Promise<Object>, containerId: string}[]}
 */
const MOVIE_SECTIONS = [
  {
    blockId: "popular-movies-block",
    fetchFunction: () => getPopularOrLatestMovies("popular"),
    containerId: "popular-movies-card-container",
  },
  {
    blockId: "latest-release-block",
    fetchFunction: () => getPopularOrLatestMovies("now_playing"),
    containerId: "latest-release-card-container",
  },
  {
    blockId: "all-movies-block",
    fetchFunction: () => getAllMovies(2026),
    containerId: "all-movies-card-container",
  },
];

/**
 * Search section configuration.
 * @type {{blockId: string, containerId: string}}
 */
const SEARCH_SECTION = {
  blockId: "search-results-block",
  containerId: "search-results-card-container",
};

/**
 * Render movies into a container using a fetch function.
 * @param {() => Promise<Object>} fetchFn - Fetch function returning movie data.
 * @param {string} containerId - Target container id.
 * @returns {Promise<void>}
 */
async function renderMovies(fetchFn, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container not found: ${containerId}`);
    return;
  }
  try {
    container.innerHTML =
      '<div class="loading text-white text-xl">Loading movies...</div>';

    const movies = await fetchFn();
    if (!movies?.results) return;

    container.innerHTML = "";

    movies.results.forEach((movie) => {
      createMovieCard(movie, containerId);
    });
  } catch (er) {
    container.innerHTML =
      '<div class="error-state text-white text-center w-full">Unable to load movies. Please try again later.</div>';
    console.error(`Error rendering movies for ${containerId} :`, er);
  }
}

/**
 * Handle search input and render results.
 * @param {string} query - Search query string.
 * @returns {void}
 */
function handleSearch(query) {
  const trimmerQuery = query.trim();
  const searchResults = document.getElementById("search-results");
  const clearButton = document.getElementById("clear-search");

  if (trimmerQuery) {
    toggleCardVisibility(true);
    searchMoviesWithDebounce(query).then(({ results }) => {
      if (!results) return;

      const searchTextBox = document.getElementById("search-textbox");
      const searchContainer = document.getElementById(
        SEARCH_SECTION.containerId,
      );

      searchContainer.innerHTML = "";
      searchResults.classList.toggle("hidden", false);
      clearButton.classList.toggle("hidden", false);

      searchResults.innerHTML = createSearchElement(results);

      searchResults.addEventListener("click", async (e) => {
        const listItem = e.target.closest(".autocomplete-item");

        if (listItem) {
          const movieId = listItem.dataset.movieId;
          toggleCardVisibility(true);
          const response = await getMovieById(movieId);

          searchResults.classList.toggle("hidden", true);
          searchResults.innerHTML = "";
          createMovieCard(response, SEARCH_SECTION.containerId);
        }
      });

      clearButton.addEventListener("click", () => {
        searchTextBox.value = "";
        searchResults.classList.toggle("hidden", true);
        searchResults.innerHTML = "";
        clearButton.classList.add("hidden");
        toggleCardVisibility(false);
      });
    });
  } else {
    searchResults.classList.toggle("hidden", true);
    searchResults.innerHTML = "";
    clearButton.classList.add("hidden");
    toggleCardVisibility(false);
  }
}

/**
 * Initialize UI bindings and render movie sections on page load.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("search-textbox")
    .addEventListener("input", (event) => {
      handleSearch(event.target.value);
    });

  await Promise.allSettled(
    MOVIE_SECTIONS.map((section) =>
      renderMovies(section.fetchFunction, section.containerId),
    ),
  );
});

/// Function for the slider arrows

/**
 * Wire up slider arrow controls for each section.
 * @returns {void}
 */
document.querySelectorAll("section").forEach((section) => {
  const container = section.querySelector(".overflow-x-auto");
  const prevBtn = section.querySelector(".prev-btn");
  const nextBtn = section.querySelector(".next-btn");

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = container.clientWidth * 0.8;

  nextBtn.addEventListener("click", () => {
    container.scrollLeft += scrollAmount;
  });

  prevBtn.addEventListener("click", () => {
    container.scrollLeft -= scrollAmount;
  });
});

/**
 * Create the HTML string for search results.
 * @param {Array} movies - List of movie objects.
 * @returns {string} HTML string for the results list.
 */
function createSearchElement(movies) {
  return movies
    .map(
      (movie, index) => `
      <li class="autocomplete-item flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-b-0" 
          data-movie-id="${movie.id}"
          data-movie-poster="${movie.poster_path}"
          data-movie-popularity="${movie.popularity}"
          data-movie-title="${movie.title}"
          data-index="${index}">
        <!-- Movie Poster -->
        <img 
          src="${movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "https://placehold.co/46x69?text=No+Image"}" 
          alt="${movie.title}"
          class="w-12 h-16 object-cover rounded shadow-sm flex-shrink-0"
        >
          <!-- Movie Info Container -->
          <div class="flex-1 min-w-0 flex flex-col gap-1">
            <div class="flex items-baseline gap-2">
              <p class="font-semibold text-gray-900 truncate">${movie.title}</p>
              <span class="text-sm text-gray-500 flex-shrink-0">${movie.release_date?.substring(0, 4) || "N/A"}</span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2 text-left">${movie.overview || "No description available"}</p>
          </div>
        
        <!-- Arrow Icon -->
        <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </li>
    `,
    )
    .join("");
}

/**
 * Toggle visibility of the search block and movie sections.
 * @param {boolean} showSearch - Whether to show the search section.
 * @returns {void}
 */
function toggleCardVisibility(showSearch) {
  const searchBlock = document.getElementById(SEARCH_SECTION.blockId);
  if (!searchBlock) return;
  MOVIE_SECTIONS.forEach((value) => {
    const block = document.getElementById(value.blockId);
    if (block) {
      block.classList.toggle("hidden", showSearch);
    }
  });
  searchBlock.classList.toggle("hidden", !showSearch);
}
