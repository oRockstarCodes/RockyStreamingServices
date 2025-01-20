import "./RegisterView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from "../context";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

function RegisterView() {
  const navigate = useNavigate();
  const { setChoices, setUser } = useStoreContext();
  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const [checkPassword, setCheckPassword] = useState("");
  const checkboxesRef = useRef({});
  const availGenres = [
    { id: 28, genre: "Action" },
    { id: 12, genre: "Adventure" },
    { id: 16, genre: "Animation" },
    { id: 35, genre: "Comedy" },
    { id: 80, genre: "Crime" },
    { id: 10751, genre: "Family" },
    { id: 14, genre: "Fantasy" },
    { id: 36, genre: "History" },
    { id: 27, genre: "Horror" },
    { id: 10402, genre: "Music" },
    { id: 9648, genre: "Mystery" },
    { id: 878, genre: "Sci-Fi" },
    { id: 53, genre: "Thriller" },
    { id: 10752, genre: "War" },
    { id: 37, genre: "Western" }
  ];

  const registerByEmail = async (event) => {
    event.preventDefault();
    try {
      const user = (await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)).user;
      await updateProfile(user, { displayName: `${firstName.current.value} ${lastName.current.value}` });
      setUser(user);
      const selectedGenres = Object.keys(checkboxesRef.current).filter((genreId) => checkboxesRef.current[genreId].checked).map(Number);
      const sortedGenres = selectedGenres.map((genreId) => availGenres.find((genre) => genre.id === genreId)).sort((a, b) => a.genre.localeCompare(b.genre));
      if (selectedGenres.length < 10) {
        alert("Please Select At Least 10 Genres");
        return;
      }
      if (password.current.value != checkPassword) {
        return alert("Passwords Do Not Match. Please Try Again.");
      }
      setChoices(sortedGenres);
      const docRef = doc(firestore, "users", user.email);
      await setDoc(docRef, { sortedGenres });
      navigate(`/movies/genre/${sortedGenres[0].id}`);
    } catch (error) {
      alert("You Have Already Registered, Please Login");
    }
  }

  const registerByGoogle = async () => {
    const selectedGenres = Object.keys(checkboxesRef.current).filter((genreId) => checkboxesRef.current[genreId].checked).map(Number);
    const sortedGenres = selectedGenres.map((genreId) => availGenres.find((genre) => genre.id === genreId)).sort((a, b) => a.genre.localeCompare(b.genre));

    if (selectedGenres.length < 10) {
      alert("Please select at least 10 genres!");
      return;
    }
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      const docRef = doc(firestore, "users", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(null);
        await signOut(auth);
        alert("You Have Already Registered, Please Login");
        return;
      } else {
        setUser(user);
        setChoices(sortedGenres);
        await setDoc(docRef, { sortedGenres });
        navigate(`/movies/genre/${sortedGenres[0].id}`);
      }

    } catch (error) {
      alert(error);
    }
  }
  return (
    <div>
      <Header showAuthButtons={false} />
      <div className="register-container">
        <h1>Create an Account</h1>
        <div className="register-form-container">
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
            <div className="checklist">
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
            </div>
            <button className="register" style={{ cursor: 'pointer' }}>Register</button>
            <button className="google-register" style={{ cursor: 'pointer ' }} onClick={() => registerByGoogle()}> Register With Google</button>
            <p className="login-link">Already have an account? <Link to={'/login'}>Login</Link></p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterView;
