import './Genres.css';
import { useNavigate } from "react-router-dom";

function Genres(props) {
  const navigate = useNavigate();
  
  const genreClick = (id) => {
    navigate(`/movies/genre/${id}`);
  }

    return (
      <div className='genre-container'>
        <ul>
          {
            props.genresList.map((item) => {
              return (
                <li key={item.id} onClick={() => genreClick(item.id)}>{item.genre}</li>
              )
            })
          }
        </ul>
      </div>
    )
  }
  
  export default Genres;