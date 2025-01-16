import "./RegisterView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { Map } from 'immutable';
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function RegisterView() {
  const navigate = useNavigate();
  const { setFirstName, setLastName, setEmail, setPassword, setChoices, setLoggedIn, setDefaultGenre, setCart, genres, setUser } = useStoreContext();
  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const [checkPassword, setCheckPassword] = useState("");
  const checkboxesRef = useRef({});

  const registerByEmail = async (event) => {
    event.preventDefault();
    const selectedGenres = Object.keys(checkboxesRef.current).filter((genreId) => checkboxesRef.current[genreId].checked).map(Number);
    const sortedGenres = selectedGenres.map((genreId) => genres.find((genre) => genre.id === genreId)).sort((a, b) => a.genre.localeCompare(b.genre));
    const user = (await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)).user;
    try {
      await updateProfile(user, { displayName: `${firstName.current.value} ${lastName.current.value}` });
      setUser(user);
      if (selectedGenres.length < 10) {
        alert("Please select at least 10 genres!");
        return;
      }
      if (password.current.value != checkPassword) {
        return alert("Passwords do not match. Please re-enter your password correctly");
      }else{
        setPassword(password.current.value);
      }
      setLoggedIn(true);
      setChoices(sortedGenres);
      setDefaultGenre(sortedGenres[0].id);
      setCart(Map());
      navigate(`/movies/genre/${sortedGenres[0].id}`);
    } catch (error) {
      alert("Error creating user with email and password!");
    }
  }

  const registerByGoogle = async () => {
    const selectedGenres = Object.keys(checkboxesRef.current).filter((genreId) => checkboxesRef.current[genreId].checked).map(Number);
    const sortedGenres = selectedGenres.map((genreId) => genres.find((genre) => genre.id === genreId)).sort((a, b) => a.genre.localeCompare(b.genre));

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres!");
      return;
    }
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      setLoggedIn(true);
      navigate(`/movies/genre/${sortedGenres[0].id}`);
    } catch (error) {
      alert("Error creating user with email and password!");
    }
  }

  return (
    <div>
      <Header showAuthButtons={false} />
      <div className="register-container">
        <div className="form-container">
          <h1>Create an Account</h1>
          <form onSubmit={(event) => { registerByEmail(event) }} action="#" method="POST">
            <label>First Name:</label>
            <input type="text" ref={firstName} onChange={(e) => setFirstName(e.target.value)} required></input>
            <label>Last Name:</label>
            <input type="text" ref={lastName} onChange={(e) => setLastName(e.target.value)} required></input>
            <label>Email:</label>
            <input type="email" ref={email} onChange={(e) => setEmail(e.target.value)} required></input>
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
          <button id="google-register" style={{ cursor: 'pointer ' }} onClick={() => registerByGoogle()}> Register With Google</button>
          <p className="login-link">Already have an account? <Link to={'/login'}>Login</Link></p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterView;
