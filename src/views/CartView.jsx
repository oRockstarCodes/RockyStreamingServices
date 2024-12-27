import "./CartView.css";
import { useStoreContext } from "../context";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

function CartView() {
  const { cart, setCart } = useStoreContext();
  const navigate = useNavigate();

  const handleAddMore = () => {
    navigate('/movies/genre/28');
  };

  return (
    <div>
      <Header />
      <div className="cart-view">
        <h1>Cart</h1>
        <div className="cart-items">
          {
            cart.entrySeq().map(([key, value]) => {
              return (
                <div className="cart-item" key={key}>
                  <h2>{value.title}</h2>
                  <img src={`https://image.tmdb.org/t/p/w500${value.url}`} height={"200px"} />
                  <button onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
                </div>
              )
            })
          }
        </div>
        <button className="add-more-button" onClick={handleAddMore}>Add More</button>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default CartView;
