import './LoginView.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useStoreContext } from '../context';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

function LoginView() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    const { setUser } = useStoreContext();
    const navigate = useNavigate();

    async function loginByEmail(e) {
        e.preventDefault();
        try {
            const user = (await signInWithEmailAndPassword(auth, email, password)).user;
            setUser(user);
            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);
            const genres = data.data().sortedGenres;
            navigate(`/movies/genre/${genres[0].id}`);
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }

    async function loginByGoogle() {
        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            setUser(user);
            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);
            const genres = data.data().sortedGenres;
            navigate(`/movies/genre/${genres[0].id}`);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="login-view">
            <Header showAuthButtons={false} />
            <div className="login-container">
                <h1>Login View</h1>
                <div className="form-container">
                    <form onSubmit={(e) => loginByEmail(e)}>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value.trim())}></input>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(event => setPassword(event.target.value))}></input>
                        <button type="submit" className="login-button">Login</button>
                        <button onClick={() => loginByGoogle()} type="submit" className="login-google-button"> Login With Google</button>
                    </form>
                    <p className="register-link">New to Rocky's Streaming Service? <Link to={'/register'}>Register now</Link></p>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default LoginView;
