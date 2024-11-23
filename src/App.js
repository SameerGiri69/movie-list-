import { useState, useEffect } from "react";
import NavBar from "./Components/NavBar";
import WatchedMovieList from "./Components/MovieList";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempMovieData);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("interstellar");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  //Api key
  const KEY = "4b34a4c0";

  function onMovieClick(movieId) {
    setSelectedMovieId((selectedMovieId) =>
      movieId === selectedMovieId ? null : movieId
    );
  }
  function onMovieClose() {
    console.log("hit");
    setSelectedMovieId(null);
  }
  useEffect(() => {
    // Ensure query is not undefined and is a string
    if (query && query.length >= 3) {
      const fetchMovies = async () => {
        try {
          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!result.ok) {
            throw new Error("Something went wrong while fetching data");
          }
          const data = await result.json();
          // Check if data.Search is defined
          if (data && data.Search) {
            setMovies(data.Search);
          } else {
            console.log("No results found.");
          }
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        }
      };

      fetchMovies();
    }
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {!error && <MovieList movies={movies} onMovieClick={onMovieClick} />}
          {error && <ErrorComponent message={error} />}
          {query == null && <ErrorComponent message={"Movies not found"} />}
        </Box>
        <Box>
          {selectedMovieId ? (
            <MovieDetail
              selectedId={selectedMovieId}
              oncloseMovie={onMovieClose}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function MovieDetail({ selectedId, oncloseMovie }) {
  return (
    <div className="details">
      <button className="btn-back" onClick={() => oncloseMovie()}>
        &larr;
      </button>
      {selectedId}
    </div>
  );
}
const average = (arr) => {
  return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
};
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function ErrorComponent({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function MovieList({ movies, onMovieClick }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onMovieClick={onMovieClick} />
      ))}
    </ul>
  );
}

function Movie({ movie, onMovieClick }) {
  return (
    <li
      onClick={() => {
        onMovieClick(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
