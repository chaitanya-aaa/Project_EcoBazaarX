import React, { useState } from "react";
import {
  FaLeaf,
  FaShoppingCart,
  FaUser,
  FaChartLine,
  FaGift,
  FaBoxOpen,
} from "react-icons/fa";
import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    name: "Chaitanya",
    email: "chaitu@example.com",
    address: "Hyderabad, India",
    ecoScore: 120,
  });

  // Mock products
  const products = [
    { id: 1, name: "Organic T-Shirt", price: 500, carbonScore: 15, seller: "EcoWear" },
    { id: 2, name: "Bamboo Toothbrush", price: 150, carbonScore: 5, seller: "GreenGoods" },
    { id: 3, name: "Solar Lamp", price: 1200, carbonScore: 20, seller: "SunLight" },
  ];

  // Eco tips for checkout
  const ecoTips = [
    "Choosing local shipping reduces CO₂ emissions.",
    "Opt for products with lower packaging footprint.",
    "Bundle orders to minimize transportation emissions.",
  ];

  // Add product to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Checkout
  const checkout = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const newOrder = {
      id: orders.length + 1,
      items: cart,
      ecoImpact: cart.reduce((sum, p) => sum + p.carbonScore, 0),
      date: new Date().toLocaleDateString(),
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    alert("Checkout successful ✅");
  };

  // Render dynamic section
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2>Profile</h2>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Address:</b> {profile.address}</p>
            <p><b>Eco-Score:</b> {profile.ecoScore}</p>
          </div>
        );

      case "products":
        return (
          <div>
            <h2>Browse Products</h2>
            <div className="product-grid">
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  <h4>{p.name}</h4>
                  <p>₹{p.price}</p>
                  <p>Seller: {p.seller}</p>
                  <p>Carbon Score: {p.carbonScore}</p>
                  <button onClick={() => addToCart(p)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        );

      case "cart":
        return (
          <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <div>
                {cart.map((c, i) => (
                  <div key={i} className="cart-item">
                    <p>{c.name} - ₹{c.price} (CO₂: {c.carbonScore})</p>
                  </div>
                ))}
                <h4>Total: ₹{cart.reduce((s, p) => s + p.price, 0)}</h4>
                <p className="eco-tip">
                  💡 {ecoTips[Math.floor(Math.random() * ecoTips.length)]}
                </p>
                <button onClick={checkout}>Checkout</button>
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div>
            <h2>Past Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <ul>
                {orders.map((o) => (
                  <li key={o.id}>
                    <FaBoxOpen /> Order #{o.id} ({o.date}) –{" "}
                    {o.items.length} items, CO₂ Impact: {o.ecoImpact}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "rewards":
        const badge =
          profile.ecoScore > 100 ? "🌍 Eco Hero" : "🍃 Green Starter";
        return (
          <div>
            <h2>Your Rewards</h2>
            <p>Eco Score: {profile.ecoScore}</p>
            <p>Badge: {badge}</p>
            <p>Leaderboard: You're in the Top 10 Eco-Shoppers 🏆</p>
          </div>
        );

      default:
        return <p>Welcome to EcoBazaar!</p>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>
          <FaLeaf /> EcoBazaar
        </h2>
        <ul>
          <li onClick={() => setActiveTab("profile")}><FaUser /> Profile</li>
          <li onClick={() => setActiveTab("products")}><FaLeaf /> Browse Products</li>
          <li onClick={() => setActiveTab("cart")}><FaShoppingCart /> Cart & Checkout</li>
          <li onClick={() => setActiveTab("orders")}><FaChartLine /> Orders</li>
          <li onClick={() => setActiveTab("rewards")}><FaGift /> Rewards</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
}
