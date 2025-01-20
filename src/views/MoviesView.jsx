import "./MoviesView.css";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Genres from "../components/Genres";
import Footer from "../components/Footer";
import { useStoreContext } from "../context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Map } from 'immutable';

function MoviesView() {
    const navigate = useNavigate();
    const { choices, user, setUser, setPrevPurchases } = useStoreContext();

    async function logout() {
        try {
            await signOut(auth)
            navigate("/login");
            setUser(null);
            signOut(auth);
            setPrevPurchases(Map());
        }catch (error){
            alert(error);
        }
    }

    return (
        <div className="app-container">
            <div className="header">
                <h1>Rocky Streaming Service</h1>
                <h1 id="title">Welcome {user.displayName.split(" ")[0]} </h1>
                <div className="header-buttons">
                    <button onClick={logout} className="logout-button">Logout</button>
                    <Link to={`/cart`} className="cart-button">Cart</Link>
                    <Link to={`/settings`} className="settings-button">Settings</Link>
                </div>
            </div>
            <div className="main-content">
                <div className="Genres">
                    <div className="genres-list">
                        <Genres genresList={choices} />
                    </div>
                </div>
                <div className="outlet">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MoviesView;
