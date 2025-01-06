import './App.css'
import HomeView from "../src/views/HomeView";
import RegisterView from "../src/views/RegisterView";
import LoginView from "../src/views/LoginView";
import MoviesView from "../src/views/MoviesView";
import DetailView from "../src/views/DetailView";
import GenreView from "../src/views/GenreView";
import AllMoviesView from "../src/views/AllMoviesView";
import CartView from "../src/views/CartView";
import SettingsView from "../src/views/SettingsView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context";

function App() {
  return (
    <>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/movies" element={<MoviesView />}>
              <Route path="all" element={<AllMoviesView />} />
              <Route path="genre/:id" element={<GenreView />} />
              <Route path="detail/:id" element={<DetailView />} />
            </Route>
            <Route path="/cart" element={<CartView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>

    </>
  )
}

export default App
