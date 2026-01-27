import {
  getAllMovies,
  getPopularOrLatestMovies,
  searchMovies,
} from "../utils/api.js";
import { createMovieCard } from "../utils/ui.js";

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

const SEARCH_SECTION = {
  blockId: "search-results-block",
  containerId: "search-results-card-container",
};

function toggleCardVisibility(showSearch) {
  const searchBlock = document.getElementById(SEARCH_SECTION.blockId);

  MOVIE_SECTIONS.forEach((value) => {
    const block = document.getElementById(value.blockId);
    block.classList.toggle("hidden", showSearch);
  });

  searchBlock.classList.toggle("hidden", !showSearch);
}

async function renderMovies(fetchFn, containerId) {
  try {
    const movies = await fetchFn();
    if (!movies?.results) return;

    movies.results.forEach((movie) => {
      createMovieCard(movie, containerId);
    });
  } catch (er) {
    console.error(`Error rendering movies for ${containerId} :`, er);
  }
}

function handleSearch(query) {
  const trimmerQuery = query.trim();

  if (trimmerQuery) {
    toggleCardVisibility(true);
    searchMovies(query).then((result) => {
      if (!result) return;

      // Clear previous search results
      const searchContainer = document.getElementById(
        SEARCH_SECTION.containerId,
      );
      searchContainer.innerHTML = "";

      // Populate search results
      result.results.forEach((movie) => {
        createMovieCard(movie, SEARCH_SECTION.containerId);
      });
    });
  } else {
    toggleCardVisibility(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("search-textbox")
    .addEventListener("input", (event) => {
      handleSearch(event.target.value);
    });

  // load all movie sections
  MOVIE_SECTIONS.forEach((value) => {
    renderMovies(value.fetchFunction, value.containerId);
  });
});

getAllMovies(2026).then((movies) => {
  if (!movies) return;

  movies.results.forEach((movie) => {
    createMovieCard(movie, "all-movies-card-container");
  });
});

/// Function for the slider arrows

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
