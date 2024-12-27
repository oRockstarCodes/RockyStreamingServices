import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AllMoviesView.css';

function AllMoviesView() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0); 
  const moviesPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    (async function getMovies() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}&page=${currentPage}`
      );
      setMovies(response.data.results);
      setTotalResults(response.data.total_results);
      setTotalPages(Math.ceil(response.data.total_results / moviesPerPage)); 
    })();
  }, [currentPage]);

  const paginateMovies = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentMovies = () => {
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    return movies.slice(indexOfFirstMovie, indexOfLastMovie);
  };

  function loadMovie(id) {
    navigate(`/movies/${id}`);
  }

  return (
    <div className="all-movies-view">
      <div className="movies-container">
        {getCurrentMovies().map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => { loadMovie(movie.id); }}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="movie-poster" />
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => paginateMovies(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => paginateMovies(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllMoviesView;
