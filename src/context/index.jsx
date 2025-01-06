import { createContext, useState, useContext } from "react";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cart, setCart] = useState(Map());
    const [loggedIn, setLoggedIn] = useState(false);
    const [choices, setChoices] = useState([]);
    const [defaultGenre, setDefaultGenre] = useState(28)
    const [genres, setGenres] = useState([
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

    return (
        <StoreContext.Provider value={{
            firstName, setFirstName, lastName, setLastName, email, setEmail,
            password, setPassword, cart, setCart, choices, setChoices, loggedIn, setLoggedIn, defaultGenre, setDefaultGenre, genres, setGenres
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}