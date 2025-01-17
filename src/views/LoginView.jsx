import './LoginView.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { useStoreContext } from '../context';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

function LoginView() {
    let [email, setEmail] = useState("");
    let [pass, setPass] = useState("");
    const { setUser } = useStoreContext();
    const navigate = useNavigate();

    async function loginByEmail(e) {
        e.preventDefault();
        try {
            const user = (await signInWithEmailAndPassword(auth, email.current.value, password)).user;
            setUser(user);
            const docu = doc(firestore, "users", user.email);
            const data = await getDoc(docu);
            const genres = data.data().sortedGenres;
            navigate(`/movies/genre/${genres[0].id}`);
        } catch (error) {
            alert("Error signing in!");
        }
    }

    async function loginByGoogle() {
        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            setUser(user);
            const docu = doc(firestore, "users", user.email);
            const data = await getDoc(docu);
            const genres = data.data().sortedGenres;
            navigate(`/movies/genre/${genres[0].id}`);
        } catch (error) {
            alert("Error Has Occured");
        }
    }

    return (
        <div className="login-view">
            <Header showAuthButtons={false} />
            <div className="login-container">
                <h1>Login View</h1>
                <div className="form-container">
                    <form onSubmit={(e) => loginByEmail(e)}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <button onClick={() => loginByGoogle()} type="submit" className="login-button"> Login With Google</button>
                    <p className="register-link">New to Rocky's Streaming Service? <Link to={'/register'}>Register now</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginView;
