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
                        const docRef = doc(firestore, "users", user.email);
                        const data = await getDoc(docRef);
                        if (data.exists()) {
                            const prevCart = Map(data.data().previous);
                            setPrevPurchases(prevCart);
                        } else {
                            setPrevPurchases(Map());
                        }
                    } catch (error) {
                        console.log(error);
                    }
                };
                getPrevPurchases();
                const getGenres = async () => {
                    try {
                        const docRef = doc(firestore, "users", user.email);
                        const data = await getDoc(docRef);
                        if (data.exists()) {
                            const genres = data.data().sortedGenres;
                            setChoices(genres);
                        }
                    } catch (error) {
                        console.log(error);
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
            cart, setCart, choices, setChoices, user, setUser, prevPurchases, setPrevPurchases, 
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}