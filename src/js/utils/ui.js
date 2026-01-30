import {
  isFavourite,
  toggleFavoriteMovie,
  FAVOURITE_KEY,
} from "./localstorage.js";
import { getData, setData } from "./localstorage.js";

/**
 * Update a favorite button's visual state.
 * @param {HTMLButtonElement} button - The favorite button element.
 * @param {number} movieId - The movie id.
 * @returns {void}
 */
function renderFavState(button, movieId) {
  if (isFavourite(movieId)) {
    button.classList.add("text-red-500");
    button.innerHTML = "❤️";
  } else {
    button.classList.remove("text-red-500");
    button.innerHTML = "♡";
  }
}

// Function to create and append the movie cards to the specified containers on the main page

/**
 * Create and append a movie card to a container.
 * @param {Object} movie - Movie data for the card.
 * @param {number} movie.id - The movie id.
 * @param {string} [movie.title] - The movie title.
 * @param {string} [movie.name] - Alternative movie name.
 * @param {string} movie.poster_path - Poster path.
 * @param {string} [movie.overview] - Movie overview.
 * @param {number} [movie.popularity] - Popularity score.
 * @param {string} containerId - DOM element id to append into.
 * @returns {void}
 */
export function createMovieCard(movie, containerId) {
  const movieCard = document.createElement("div");
  movieCard.classList.add(
    'bg-white',
    'rounded-lg',
    'shadow-md',
    'min-w-[300px]',
    'w-[300px]',
    'hover:scale-102',
    'transition-transform',
    'duration-300',
    'relative'
  );

  const favButton = document.createElement("button");
  favButton.innerHTML = "♡";
  favButton.classList.add(
    "absolute",
    "top-3",
    "right-2",
    "bg-black/40",
    "hover:bg-black/80",
    "text-white",
    "text-xl",
    "w-9",
    "h-9",
    "rounded-full",
    "flex",
    "items-center",
    "justify-center",
    "transition",
  );

  favButton.dataset.movieId = movie.id;
  favButton.classList.add("fav-btn");

  renderFavState(favButton, movie.id);

  // Add click event to toggle favorite
  favButton.addEventListener("click", () => {
    toggleFavoriteMovie(movie);

    document
      .querySelectorAll(`.fav-btn[data-movie-id="${movie.id}"]`)
      .forEach((btn) => renderFavState(btn, movie.id));
  });

  const movieImage = document.createElement("img");
  movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieImage.alt = movie.title;
  movieImage.classList.add(
    "mb-2",
    "rounded",
    "aspect-[2/3]",
    "w-full",
    "object-cover",
  );

  const movieName = document.createElement("h3");
  movieName.textContent = movie.title || movie.name || "undefined";
  movieName.classList.add("text-xl", "font-bold", "p-4");

  const movieInfo = document.createElement("p");
  movieInfo.innerHTML = `
  <strong>Popularity rate:</strong> ${movie.popularity}<br>
  <strong>Synopsis:</strong> ${movie.overview}`; // info(movie);
  movieInfo.classList.add("text-gray-700", "text-sm", "line-clamp-3", "p-4", "pt-0");

  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieName);
  movieCard.appendChild(movieInfo);
  movieCard.appendChild(favButton);
  document.getElementById(containerId).appendChild(movieCard);
}

//Function to create and append the movie cards on journal page with a section to submit notes

/**
 * Create and append a favourite movie card with notes.
 * @param {Object} movie - Movie data for the card.
 * @param {number} movie.id - The movie id.
 * @param {string} [movie.title] - The movie title.
 * @param {string} [movie.name] - Alternative movie name.
 * @param {string} movie.poster_path - Poster path.
 * @param {string} [movie.overview] - Movie overview.
 * @param {string} [movie.note] - Saved note for the movie.
 * @param {string} containerId - DOM element id to append into.
 * @returns {void}
 */
export function createFavMovieCard(movie, containerId) {
  const movieCard = document.createElement("div");
  movieCard.classList.add(
    "bg-neutral-200",
    "rounded-lg",
    "p-4",
    "w-full",
    "sm:w-[340px]",
    "md:w-[400px]",
    "lg:w-[480px]",
    "xl:w-[520px]",
    "flex",
    "gap-4",
  );

  /* ---------- LEFT SIDE ---------- */
  const leftSection = document.createElement("div");
  leftSection.classList.add("w-1/3", "flex", "flex-col");

  const movieImage = document.createElement("img");
  movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieImage.alt = movie.title || movie.name;
  movieImage.classList.add(
    "mb-2",
    "rounded",
    "aspect-[2/3]",
    "w-full",
    "object-cover",
  );

  const movieName = document.createElement("h3");
  movieName.textContent = movie.title || movie.name || "Untitled";
  movieName.classList.add("text-xl", "font-bold", "mb-2");

  const synopsis = document.createElement("p");
  synopsis.textContent = movie.overview || "No synopsis available.";
  synopsis.classList.add("text-sm", "text-gray-600", "line-clamp-5");

  leftSection.append(movieImage, movieName, synopsis);

  /* ---------- RIGHT SIDE ---------- */
  const rightSection = document.createElement("div");
  rightSection.classList.add("md:w-2/3", "w-full", "flex", "flex-col");

  const notesLabel = document.createElement("label");
  notesLabel.textContent = "Your Notes:";
  notesLabel.classList.add("font-medium", "mb-1");

  const notesTextarea = document.createElement("textarea");
  notesTextarea.placeholder = "Write your notes here...";
  notesTextarea.innerText = movie.note ? movie.note : "";
  notesTextarea.classList.add(
    "flex-grow",
    "p-2",
    "border",
    "border-gray-300",
    "rounded",
    "resize-none",
    "mb-2",
  );

  const submitButton = document.createElement("button");
  submitButton.textContent = "Save Notes";
  submitButton.classList.add(
    "bg-gray-800",
    "text-white",
    "py-2",
    "rounded",
    "hover:bg-gray-600",
    "transition",
  );

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const note = notesTextarea.value.trim();

    const favData = getData(FAVOURITE_KEY);

    const favIndex = favData.findIndex((fav) => fav.id === movie.id);

    if (favIndex !== -1) {
      // Update the item at that index
      favData[favIndex] = {
        ...favData[favIndex],
        note,
      };
    }

    setData(FAVOURITE_KEY, [...favData]);
    submitButton.textContent = "Notes added!";
  });

  rightSection.append(notesLabel, notesTextarea, submitButton);

  /* ---------- ASSEMBLE ---------- */
  movieCard.append(leftSection, rightSection);
  document.getElementById(containerId).appendChild(movieCard);
}
