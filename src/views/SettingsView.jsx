import "./SettingsView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";

function SettingsView() {
  const { user, setUser, choices, setChoices, prevPurchases } = useStoreContext();
  const [fName, setfName] = useState(user.displayName.split(" ")[0]);
  const [lName, setlName] = useState(user.displayName.split(" ")[1]);
  const currentPassword = useRef('');
  const newPassword = useRef('');
  const confirmPassword = useRef('');
  const navigate = useNavigate();
  const genres = [
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
  const checkboxesRef = useRef({});

  async function changeName(event) {
    event.preventDefault();

    try {
      const currentUser = auth.currentUser;
      await updateProfile(currentUser, {
        displayName: `${fName} ${lName}`,
      });

      setUser((prevUser) => ({
        ...prevUser,
        displayName: `${fName} ${lName}`,
      }));

      alert("Name Change Successful");
    } catch (error) {
      alert(error);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    const currentUser = auth.currentUser;
    if (newPassword.current.value != confirmPassword.current.value) {
      return alert("Your Passwords Do Not Match, Please Try Again")
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword.current.value)
      await reauthenticateWithCredential(currentUser, credential);
    } catch (error) {
      return alert("Old Password Invalid, Please Try Again");
    }

    try {
      await updatePassword(currentUser, newPassword.current.value);
      currentPassword.current.value = '';
      newPassword.current.value = '';
      confirmPassword.current.value = '';
      return alert("Password updated!");
    } catch (error) {
      return alert(error);
    }

  }

  async function updateGenres() {
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

    setChoices(sortedGenres);
    const docRef = doc(firestore, "users", user.email);
    await setDoc(docRef, { sortedGenres: sortedGenres, previous: prevPurchases.toJS() });
    alert("Genres Have been updated!")
  }

  async function goBack() {
    const data = await getDoc(doc(firestore, "users", user.email));
    const genres = data.data().sortedGenres;
    navigate(`/movies/genre/${genres[0].id}`);
  }

  return (
    <div>
      <Header showAuthButtons={false} />
      <div className="settings">
        <div className="profile">
          <h1>User Settings</h1>
          {user.emailVerified ? (
            <div className="change-name">
              <h2>You're signed in with Google</h2>
              <label>First Name:</label>
              <input type="text" value={fName} readOnly></input>
              <label>Last Name:</label>
              <input type="text" value={lName} readOnly></input>
            </div>
          ) : (
            <form className="change-name" onSubmit={(event) => { changeName(event) }}>
              <h2>Profile</h2>
              <label>First Name:</label>
              <input type="text" value={fName} onChange={(event) => setfName(event.target.value)} required></input>
              <label>Last Name:</label>
              <input type="text" value={lName} onChange={(event) => setlName(event.target.value)} required></input>
              <button>Change Name</button>
            </form>
          )}
          <br></br>
          {user.emailVerified ? (
            <></>
          ) : (
            <div className="password">
              <h1>Change Password</h1>
              <form className="change-password" onSubmit={(event) => { changePassword(event) }}>
                <label>Old Password:</label>
                <input type="password" ref={currentPassword}></input>
                <label>New Password:</label>
                <input type="password" ref={newPassword}></input>
                <label>Confirm Password</label>
                <input type="password" ref={confirmPassword}></input>
                <button>Change Password</button>
              </form>
            </div>

          )}
          <div className="checklist">
            <h2>Genres</h2>
            <p>Edit your 10 preferred genres</p>
            {genres.map((item) => {
              const isChecked = choices.some(choice => choice.id == item.id);
              return (
                <div key={item.id}>
                  <input
                    type="checkbox"
                    id="check"
                    defaultChecked={isChecked}
                    ref={(el) => (checkboxesRef.current[item.id] = el)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="genre-name">{item.genre}</label>
                </div>
              );
            })}
            <br></br>
            <button onClick={() => updateGenres()}>Update Your Genres</button>
          </div>
          <div className="back-button">
            <button onClick={() => goBack()}>Go Back</button>
          </div>
        </div>

        <div className="previous-purchases">
          <h2>Previous Purchases</h2>
          <div className="purchases">
            {prevPurchases.entrySeq().map(([key, value]) => {
              return (
                <div key={key}>
                  <li>{value.title}</li>
                  <img src={`https://image.tmdb.org/t/p/w500${value.url}`} height={"200px"} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


export default SettingsView;