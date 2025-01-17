import "./RegisterView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../context";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function RegisterView() {
  const navigate = useNavigate();
  const {  setChoices, availGenres, setUser } = useStoreContext();
  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const [checkPassword, setCheckPassword] = useState("");
  const checkboxesRef = useRef({});

  const registerByEmail = async (event) => {
    event.preventDefault();
    try {
      const user = (await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)).user;
      await updateProfile(user, { displayName: `${firstName.current.value} ${lastName.current.value}` });
      setUser(user);
      const selectedGenres = Object.keys(checkboxesRef.current).filter((genreId) => checkboxesRef.current[genreId].checked).map(Number);
      const sortedGenres = selectedGenres.map((genreId) => genres.find((genre) => genre.id === genreId)).sort((a, b) => a.genre.localeCompare(b.genre));
      if (selectedGenres.length < 10) {
        alert("Please Select At Least 10 Genres");
        return;
      }
      if (password.current.value != checkPassword) {
        return alert("Passwords Do Not Match. Please Try Again.");
      }else{
        setPassword(password.current.value);
      }
      setChoices(sortedGenres);
      const docu = doc(firestore, "users", user.email);
      await setDoc(docu, {sortedGenres});
      navigate(`/movies/genre/${sortedGenres[0].id}`);
    } catch (error) {
      alert("Error Occured");
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
      setChoices(sortedGenres);
      const docu = doc(firestore, "users", user.email);
      await setDoc(docu, {sortedGenres});
      navigate(`/movies/genre/${sortedGenres[0].id}`);
    } catch (error) {
      alert("Error Has Occured");
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
            {availGenres.map((item) => (
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
