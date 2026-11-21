import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Passport from "./pages/Passport";
import Shop from "./pages/Shop";
import Compare from "./pages/Compare";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Delivery from "./pages/Delivery";
import Companion from "./pages/Companion";
import Support from "./pages/Support";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route element={<Layout />}>
        <Route path="/passport" element={<Passport />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/companion" element={<Companion />} />
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  );
}


