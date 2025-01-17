import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [choices, setChoices] = useState([]);
    const [cart, setCart] = useState(Map());
    const [prevPurchases, setPrevPurchases] = useState(Map());
    const [loading, setLoading] = useState(true);
    const [availGenres, setAvailGenres] = useState([
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
    ]);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            setUser(user);
            if (user) {
                const sessionCart = localStorage.getItem(user.email);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                } else {
                    setCart(Map());
                }
                const getPrevPurchases = async () => {
                    try {
                        const docu = doc(firestore, "users", user.email);
                        const data = await getDoc(docu);
                        if (data.exists()) {
                            const prevCart = Map(data.data().previous);
                            setPrevPurchases(prevCart);
                        } else {
                            setPrevPurchases(Map());
                        }
                    } catch (error) {
                        alert("Cart error");
                    }
                };
                getPrevPurchases();

                const getGenres = async () => {
                    try {
                        const docu = doc(firestore, "users", user.email);
                        const data = await getDoc(docu);
                        if (data.exists()) {
                            const genres = data.data().sortedGenres;
                            setChoices(genres);
                        }
                    } catch (error) {
                        alert("Genre error");
                    }
                };
                getGenres();
            }
            setLoading(false);
        });
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <StoreContext.Provider value={{
            cart, setCart, choices, setChoices, user, setUser, prevPurchases, setPrevPurchases, availGenres, setAvailGenres
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}