const FAVOURITE_KEY = "favourite";

export function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(`Error getting the data from localStorage: ${error}`);
    return [];
  }
}

function setData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(`Error storing the data in localStorage: ${error}`);
  }
}

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

export function addNotes(movie, notes) {
  if (notes) {
    this.toggleFavoriteMovie(movie);

    // need to implement notes storage
  } else {
    console.log("No notes to add");
  }
}

export function isFavourite(id) {
  return getData(FAVOURITE_KEY).some((fav) => fav.id === id);
}

export function getFavouriteMovies() {
  return getData(FAVOURITE_KEY); // returns array of favourite IDs
}
