import "./CartView.css";
import { useStoreContext } from "../context";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Map } from 'immutable';

function CartView() {
  const { cart, setCart, user, prevPurchases, setPrevPurchases, choices } = useStoreContext();
  const navigate = useNavigate();

  async function handleAddMore() {
    const docRef = doc(firestore, "users", user.email);
    const data = await getDoc(docRef);
    const genres = data.data().sortedGenres;
    navigate(`/movies/genre/${genres[0].id}`);
  };

  function removeCart(key) {
    setCart((prevCart) => {
      const newCart = prevCart.delete(key);
      localStorage.removeItem(user.email);
      localStorage.setItem(user.email, JSON.stringify(newCart.toJS()));
      return newCart;
    });
  }

  const checkout = async () => {
    if (cart.size <= 0) {
      return alert("Your Cart is Empty.");
    }

    const purchases = prevPurchases.merge(cart);
    setPrevPurchases(purchases);
    const docRef = doc(firestore, "users", user.email);
    await setDoc(docRef, { sortedGenres: choices, previous: purchases.toJS() });
    localStorage.removeItem(user.email);
    setCart(Map());
    handleAddMore();
    return alert("Purchase Completed. Your Movies will arrive in 3-5 business days");
  }

  return (
    <div>
      <Header showAuthButtons={false} />
      <div className="cart-view">
        <h1>Cart</h1>
        <div className="cart-items">
          {
            cart.entrySeq().map(([key, value]) => {
              return (
                <div className="cart-item" key={key}>
                  <h2>{value.title}</h2>
                  <img src={`https://image.tmdb.org/t/p/w500${value.url}`} height={"200px"} />
                  <button onClick={() => removeCart(key)}>Remove</button>
                </div>
              )
            })
          }
        </div>
        <div className="button-container">
          <button className="add-more-button" onClick={handleAddMore}>Add More</button>
          <button className="purchase-button" onClick={() => checkout()}>Purchase</button>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default CartView;
