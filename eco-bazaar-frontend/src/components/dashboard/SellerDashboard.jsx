import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";
import "./SellerDashboard.css";

const ECO_RATING = (carbonScore) => {
  // simple rule: lower carbon => better rating (A..D)
  if (carbonScore <= 5) return "A";
  if (carbonScore <= 15) return "B";
  if (carbonScore <= 30) return "C";
  return "D";
};

export default function SellerDashboard() {
  const sellerId = localStorage.getItem("userId") || "seller-123"; // fallback
  const sellerName = localStorage.getItem("sellerName") || "Demo Seller";

  const [profile, setProfile] = useState({
    id: sellerId,
    name: sellerName,
    businessName: "EcoBazaar Shop",
    verified: false,
    email: "seller@ecobazaar.com",
    phone: "9999999999",
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [form, setForm] = useState({
    id: null, name: "", price: "", description: "", carbonScore: 0, image: "", stock: 0
  });

  // load from localStorage
  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const sellerProducts = allProducts.filter(p => p.sellerId === profile.id);
    setProducts(sellerProducts);

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const sellerOrders = allOrders.filter(o => o.sellerId === profile.id);
    setOrders(sellerOrders);

    const storedProfile = JSON.parse(localStorage.getItem("sellerProfile"));
    if (storedProfile && storedProfile.id === profile.id) setProfile(storedProfile);
  }, [profile.id]);

  useEffect(() => {
    // persist products to global list in localStorage
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    // remove existing seller products then add current
    const others = allProducts.filter(p => p.sellerId !== profile.id);
    const merged = [...others, ...products];
    localStorage.setItem("products", JSON.stringify(merged));
  }, [products, profile.id]);

  useEffect(() => {
    // persist orders globally
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const others = allOrders.filter(o => o.sellerId !== profile.id);
    const merged = [...others, ...orders];
    localStorage.setItem("orders", JSON.stringify(merged));
  }, [orders, profile.id]);

  // Product operations
  const resetForm = () => setForm({ id: null, name: "", price: "", description: "", carbonScore: 0, image: "", stock: 0 });

  const handleAddOrUpdateProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      ...form,
      id: form.id || `p-${Date.now()}`,
      sellerId: profile.id,
      sellerName: profile.name,
      price: Number(form.price),
      carbonScore: Number(form.carbonScore),
      ecoRating: ECO_RATING(Number(form.carbonScore))
    };

    if (form.id) {
      // update
      setProducts(products.map(p => p.id === form.id ? newProduct : p));
    } else {
      // add
      setProducts([...products, newProduct]);
    }
    resetForm();
    setTab("products");
  };

  const handleEditProduct = (p) => {
    setForm({
      id: p.id, name: p.name, price: p.price, description: p.description,
      carbonScore: p.carbonScore, image: p.image, stock: p.stock || 0
    });
    setTab("products");
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Delete product?")) return;
    setProducts(products.filter(p => p.id !== id));
  };

  const updateStock = (id, delta) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p));
  };

  // Orders
  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Analytics helpers
  const topProducts = (() => {
    // count products sold from orders
    const counts = {};
    orders.forEach(o => {
      o.items.forEach(it => {
        counts[it.productId] = (counts[it.productId] || 0) + it.quantity;
      });
    });
    return products.map(p => ({ ...p, sold: counts[p.id] || 0 })).sort((a,b)=>b.sold-a.sold).slice(0,5);
  })();

  const totalCarbonImpact = products.reduce((sum, p) => {
    // assume sold units from orders multiplied by carbonScore
    const soldCount = orders.reduce((s, o) => s + (o.items.filter(i => i.productId===p.id).reduce((x,y)=>x+y.quantity,0)), 0);
    return sum + (soldCount * (p.carbonScore || 0));
  }, 0);

  // helper to create a fake order for testing
  const createTestOrder = () => {
    if (products.length === 0) return alert("Add a product first");
    const sample = products[0];
    const newOrder = {
      id: `o-${Date.now()}`,
      sellerId: profile.id,
      buyerName: "Test Buyer",
      status: "pending",
      createdAt: new Date().toISOString(),
      items: [{ productId: sample.id, name: sample.name, quantity: 1, price: sample.price }]
    };
    setOrders([newOrder, ...orders]);
  };

  return (
    <div className="seller-dashboard">
      <header className="sd-header">
        <h1>Seller Dashboard</h1>
        <div className="seller-profile">
          <strong>{profile.businessName}</strong>
          <div>{profile.email}</div>
          <div>Status: <span className={`status ${profile.verified ? "verified":"pending"}`}>{profile.verified ? "Verified" : "Unverified"}</span></div>
        </div>
      </header>

      <nav className="sd-nav">
        <button className={tab==="dashboard"?"active":""} onClick={()=>setTab("dashboard")}>Dashboard</button>
        <button className={tab==="products"?"active":""} onClick={()=>setTab("products")}>Products</button>
        <button className={tab==="orders"?"active":""} onClick={()=>setTab("orders")}>Orders</button>
        <button className={tab==="analytics"?"active":""} onClick={()=>setTab("analytics")}>Analytics</button>
        <button onClick={()=>{ localStorage.removeItem("role"); localStorage.removeItem("userId"); window.location.href="/login"; }}>Logout</button>
      </nav>

      <main className="sd-main">
        {tab === "dashboard" && (
          <section className="sd-section">
            <h2>Quick Overview</h2>
            <div className="overview-cards">
              <div className="card">
                <h3>Products</h3>
                <p>{products.length}</p>
              </div>
              <div className="card">
                <h3>Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="card">
                <h3>Total Carbon Impact</h3>
                <p>{totalCarbonImpact} kg CO₂</p>
              </div>
            </div>

            <div className="recent-section">
              <h3>Recent Orders</h3>
              <ul className="orders-list">
                {orders.slice(0,5).map(o => (
                  <li key={o.id}>
                    <strong>{o.buyerName}</strong> — {o.status} — {new Date(o.createdAt).toLocaleString()}
                    <div>
                      {o.items.map(it => <span key={it.productId}>{it.name} x{it.quantity} </span>)}
                    </div>
                  </li>
                ))}
                {orders.length===0 && <li>No orders yet</li>}
              </ul>
            </div>
          </section>
        )}

        {tab === "products" && (
          <section className="sd-section">
            <h2>Product Management</h2>

            <form className="product-form" onSubmit={handleAddOrUpdateProduct}>
              <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
              <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
              <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} required />
              <input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
              <input placeholder="Carbon Score (kg CO2 per unit)" type="number" value={form.carbonScore} onChange={e=>setForm({...form, carbonScore:e.target.value})} required />
              <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
              <div className="form-actions">
                <button type="submit" className="btn"> {form.id ? "Update Product":"Add Product"} </button>
                <button type="button" className="btn secondary" onClick={resetForm}>Reset</button>
              </div>
            </form>

            <div className="products-grid">
              {products.map(p => (
                <div className="product-card" key={p.id}>
                  <img src={p.image || "https://via.placeholder.com/160x100.png?text=No+Image"} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>Price: ₹{p.price}</p>
                  <p>Stock: {p.stock || 0}</p>
                  <p>Carbon: {p.carbonScore} kg — Rating: <strong>{p.ecoRating}</strong></p>
                  <div className="p-actions">
                    <button onClick={()=>handleEditProduct(p)}>Edit</button>
                    <button onClick={()=>handleDeleteProduct(p.id)}>Delete</button>
                    <button onClick={()=>updateStock(p.id, 1)}>+ Stock</button>
                    <button onClick={()=>updateStock(p.id, -1)}>- Stock</button>
                  </div>
                </div>
              ))}
              {products.length===0 && <p>No products yet — add one above.</p>}
            </div>
          </section>
        )}

        {tab === "orders" && (
          <section className="sd-section">
            <h2>Orders</h2>
            <button className="btn" onClick={createTestOrder}>Create Test Order</button>
            <table className="orders-table">
              <thead><tr><th>Order</th><th>Buyer</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.buyerName}</td>
                    <td>{o.items.map(i=>`${i.name} x${i.quantity}`).join(", ")}</td>
                    <td>{o.status}</td>
                    <td>
                      <button onClick={()=>handleUpdateOrderStatus(o.id, "shipped")}>Mark Shipped</button>
                      <button onClick={()=>handleUpdateOrderStatus(o.id, "delivered")}>Mark Delivered</button>
                      <button onClick={()=>handleUpdateOrderStatus(o.id, "cancelled")}>Cancel</button>
                    </td>
                  </tr>
                ))}
                {orders.length===0 && <tr><td colSpan="5">No orders yet</td></tr>}
              </tbody>
            </table>
          </section>
        )}

        {tab === "analytics" && (
          <section className="sd-section">
            <h2>Seller Analytics</h2>
            <div className="charts-analytics">
              <div className="chart-card">
                <h4>Top Selling Products</h4>
                <BarChart width={500} height={300} data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#82ca9d" />
                </BarChart>
              </div>

              <div className="chart-card">
                <h4>Carbon Impact (by product)</h4>
                <PieChart width={300} height={300}>
                <Pie
  data={products.map(p => ({
    name: p.name,
    value: orders.reduce(
      (s, o) =>
        s +
        o.items
          .filter(it => it.productId === p.id)
          .reduce((x, y) => x + y.quantity, 0) *
          (p.carbonScore || 0),
      0
    )
  }))}
  dataKey="value"
  nameKey="name"
  outerRadius={100}
  label
>
  {products.map((entry, index) => (
    <Cell
      key={`c-${index}`}
      fill={["#82ca9d", "#8884d8", "#ffc658", "#ff7f50"][index % 4]}
    />
  ))}
</Pie>
<Tooltip />

                </PieChart>
                <p>Total carbon impact: <strong>{totalCarbonImpact} kg CO₂</strong></p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="shop-now">
        <button onClick={()=>window.alert("Browse products (static)")}>🛒 Browse All Products</button>
        <button onClick={()=>window.alert("View Cart & Checkout (static)")}>🧾 View Cart & Checkout</button>
      </footer>
    </div>
  );
}
