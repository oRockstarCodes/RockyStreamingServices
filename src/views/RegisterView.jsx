import "./RegisterView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { Map } from 'immutable';
import { Link } from "react-router-dom";

function RegisterView() {
  const navigate = useNavigate();
  const { setFirstName, setLastName, setEmail, setPassword, setChoices, setLoggedIn, setDefaultGenre, setCart, genres } = useStoreContext();
  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const [checkPassword, setCheckPassword] = useState("");
  const checkboxesRef = useRef({});


  function register(event) {
    event.preventDefault();
    if (password.current.value != checkPassword) {
      return alert("Passwords do not match. Please re-enter your password correctly");
    }

    const selectedGenres = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres!");
      return;
    }

    const sortedGenres = selectedGenres
      .map((genreId) => genres.find((genre) => genre.id === genreId))
      .sort((a, b) => a.genre.localeCompare(b.genre));

    alert("Account Successfully Created")
    setFirstName(firstName.current.value);
    setLastName(lastName.current.value);
    setEmail(email.current.value);
    setPassword(password.current.value);
    setLoggedIn(true);
    setChoices(sortedGenres);
    setDefaultGenre(sortedGenres[0].id);
    //resets cart to empty upon registration
    setCart(Map());
    navigate(`/movies/genre/${sortedGenres[0].id}`);
  }
  return (
    <div>
      <Header showAuthButtons={false} />
      <div className="register-container">
        <div className="form-container">
          <h1>Create an Account</h1>
          <form onSubmit={(event) => { register(event) }} action="#" method="POST">
            <label>First Name:</label>
            <input type="text" ref={firstName} required></input>
            <label>Last Name:</label>
            <input type="text" ref={lastName} required></input>
            <label>Email:</label>
            <input type="email" ref={email} required></input>
            <label>Password:</label>
            <input type="password" ref={password} required></input>
            <label>Confirm Password:</label>
            <input type="password" value={checkPassword} onChange={(event) => { setCheckPassword(event.target.value) }} required></input>
            <p>Please choose up to 10 preferred genres</p>
            {genres.map((item) => (
              <div key={item.id}>
                <input
                  type="checkbox"
                  id="check"
                  ref={(el) => (checkboxesRef.current[item.id] = el)}
                  style={{ cursor: 'pointer' }}
                />
                <label className="genre-name">{item.genre}</label>
              </div>
            ))}
            <button id="register" style={{ cursor: 'pointer' }}>Register</button>
          </form>
          <p className="login-link">
            Already have an account? <Link to={'/login'}>Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterView;
