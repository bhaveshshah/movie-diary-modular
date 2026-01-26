import { isFavourite, toggleFavoriteMovie, addNotes } from "./localstorage.js";

let currentSelectedMovie;
function renderFavState(button, movieId) {
  if (isFavourite(movieId)) {
    button.classList.add("text-red-500");
    button.innerHTML = "❤️";
  } else {
    button.classList.remove("text-red-500");
    button.innerHTML = "♡";
  }
}

/**
 * function to create the movie card
 */
export function createMovieCard(movie, containerId) {
  const movieCard = document.createElement("div");
  movieCard.classList.add(
    "bg-white",
    "rounded-lg",
    "shadow-md",
    "p-4",
    "min-w-[200px]",
    "w-[200px]",
    "hover:scale-105",
    "transition-transform",
    "duration-300",
    "relative",
  );

  movieCard.appendChild(createMoviePoster(movie));
  movieCard.appendChild(getMovieTitle(movie));
  movieCard.appendChild(createMovieInfo(movie));
  movieCard.appendChild(createFavButton(movie));
  movieCard.appendChild(createNotesButton(movie));
  document.getElementById(containerId).appendChild(movieCard);
}

function openNotesModal(movie) {
  currentSelectedMovie = movie;
  const modal = document.getElementById("notes-modal");
  const titleElement = document.getElementById("modal-movie-title");
  const notesTextarea = document.getElementById("movie-notes");

  // Set movie title
  titleElement.textContent = movie.title;

  // Load existing notes
  const existingNotes = localStorage.getItem(`movie-notes-${movie.id}`) || "";
  notesTextarea.value = existingNotes;

  // Show modal
  modal.classList.remove("hidden");

  // Focus on textarea
  notesTextarea.focus();
}

function createNotesButton(movie) {
  const notesButton = document.createElement("button");
  notesButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    `;
  notesButton.classList.add(
    "absolute",
    "bottom-2",
    "right-2",
    "bg-blue-400",
    "hover:bg-blue-700",
    "text-white",
    "w-9",
    "h-9",
    "rounded-full",
    "flex",
    "items-center",
    "justify-center",
    "transition-all",
    "z-20",
  );
  notesButton.setAttribute("aria-label", "Add notes");
  notesButton.dataset.movieId = movie.id;
  notesButton.dataset.movieTitle = movie.title || movie.name;

  // ✅ NEW: Add click event to open notes modal
  notesButton.addEventListener("click", () => {
    openNotesModal(movie);
  });

  document.querySelectorAll(".close-modal-btn").forEach((button) => {
    button.addEventListener("click", closeNotesModal);
  });

  const modal = document.getElementById("notes-modal");

  // Event delegation - one listener for the entire modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeNotesModal();
      return;
    }

    if (e.target.closest(".close-modal-btn")) {
      closeNotesModal();
      return;
    }

    // Handle save button
    if (e.target.closest(".save-notes-btn")) {
      const textData = document.getElementById("movie-notes").value;
      addNotes(movie, textData);
      return;
    }
  });

  // ✅ NEW: Show indicator if notes exist
  const hasNotes = localStorage.getItem(`movie-notes-${movie.id}`);
  if (hasNotes) {
    notesButton.classList.add("ring-2", "ring-yellow-400");
  }

  return notesButton;
}

function createFavButton(movie) {
  const favButton = document.createElement("button");
  favButton.innerHTML = "♡";
  favButton.classList.add(
    "absolute",
    "top-2",
    "right-2",
    "bg-black/60",
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
    debugger;
    toggleFavoriteMovie(movie);

    document
      .querySelectorAll(`.fav-btn[data-movie-id="${movie.id}"]`)
      .forEach((btn) => renderFavState(btn, movie.id));
  });

  return favButton;
}

function closeNotesModal() {
  const modal = document.getElementById("notes-modal");
  modal.classList.add("hidden");
  currentSelectedMovie = null;
}

function getMovieTitle({ title, name }) {
  const movieName = document.createElement("h3");
  movieName.textContent = title || name || "No Name Found";
  movieName.classList.add("text-x", "font-bold");

  return movieName;
}

function createMovieInfo({ popularity, overview }) {
  const movieInfo = document.createElement("p");
  movieInfo.textContent = `Popularity rate: ${popularity}, Synopsis: ${overview}`; // info(movie);
  movieInfo.classList.add("text-gray-500", "text-sm", "line-clamp-3");

  return movieInfo;
}

function createMoviePoster({ title, poster_path }) {
  const movieImage = document.createElement("img");
  movieImage.src = `https://image.tmdb.org/t/p/w500${poster_path}`;
  movieImage.alt = title;
  movieImage.classList.add("mb-2");

  return movieImage;
}
