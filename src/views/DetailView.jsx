import "./DetailView.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetailView() {
  const [movDetails, setMovDetails] = useState([]);
  const [production, setProduction] = useState([]);
  const params = useParams();

  useEffect(() => {
    (async function getGenre() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`
      );
      setMovDetails(response.data);
      setProduction(response.data.production_companies);
    })();
  }, [params.id]);

  function getCompanies() {
    return production.map((company, index) => company.name).join(", ");
  }

  function getOnlyTrailers(videos) {
    let trailers = videos.filter((vid) => vid.type === "Trailer");
    if (trailers.length <= 0) {
      return <p>No Trailers Available</p>;
    }

    return trailers.map((trailer) => (
      <div key={trailer.id} className="trailer-tile">
        <a
          href={`https://www.youtube.com/watch?v=${trailer.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="trailer-thumbnail"
            src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
            alt={trailer.name}
          />
          <h3 className="trailer-title">{trailer.name}</h3>
        </a>
      </div>
    ));
  }

  return (
    <div className="detail-view-container">
      <h1 className="movie-title">{movDetails.original_title}</h1>
      <div className="movie-info">
        <p><strong>Release Date:</strong> {movDetails.release_date}</p>
        <p><strong>Runtime:</strong> {movDetails.runtime} mins</p>
        <p><strong>Language:</strong> {movDetails.original_language}</p>
        <p><strong>Production Companies:</strong> {getCompanies()}</p>
        <p><strong>Description:</strong> {movDetails.overview}</p>
      </div>

      <div className="poster-container">
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w500${movDetails.poster_path}`}
          alt={movDetails.original_title}
        />
      </div>

      <div className="trailers-section">
        <h2>Trailers</h2>
        <div className="trailers-grid">
          {movDetails.videos && movDetails.videos.results.length > 0
            ? getOnlyTrailers(movDetails.videos.results)
            : <p>No Trailers Available</p>}
        </div>
      </div>
    </div>
  );
}

export default DetailView;
