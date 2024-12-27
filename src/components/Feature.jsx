import './Feature.css';
import { useEffect, useState } from 'react';
import axios from "axios";

function Feature() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    (async function getPosters() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );

      setPosters(response.data.results);
    })()
  }, []);

  return (
    <section className="feature">
      <h2>Explore Our Featured Options</h2>
      <p>Discover a curated selection of movies and shows just for you.</p>
      <div className="feature-buttons">
        <button>Browse Movies</button>
        <button>Watch Trailers</button>
        <button>See Recommendations</button>
      </div>
      <div className="feature-images">
        {posters.length > 0 ? (
          <div>
            <img height={"500px"}
              src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5))].poster_path}`}
            />
            <img height={"500px"}
              src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5 + 5))].poster_path}`}
            />
            <img height={"500px"}
              src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5 + 10))].poster_path}`}
            />
            <img height={"500px"}
              src={`https://image.tmdb.org/t/p/w500${posters[Math.floor((Math.random() * 5 + 15))].poster_path}`}
            />
          </div>
        ) : (
          <p>Posters are loading</p>
        )}
      </div>
    </section>
  )
}

export default Feature;