import React, { useState, useEffect } from "react";
import { 
  FaUserShield, FaUsers, FaBox, FaChartPie, FaCheck, FaBan, FaEdit, FaShoppingCart 
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [footprints, setFootprints] = useState([]);
  const [cart, setCart] = useState([]);
  const [userForm, setUserForm] = useState({ name: "", role: "Customer", status: "active", id: null });

  // Load dummy data
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [
      { id: 1, name: "Alice", role: "Customer", status: "active" },
      { id: 2, name: "Bob", role: "Seller", status: "pending" },
      { id: 3, name: "Charlie", role: "Customer", status: "active" },
      { id: 4, name: "Diana", role: "Seller", status: "active" },
    ];

    const storedProducts = JSON.parse(localStorage.getItem("products")) || [
      { id: 1, name: "Eco Bag", price: 250, carbonScore: 12, seller: "Bob" },
      { id: 2, name: "Organic T-Shirt", price: 500, carbonScore: 18, seller: "Bob" },
      { id: 3, name: "Reusable Bottle", price: 350, carbonScore: 8, seller: "Diana" },
      { id: 4, name: "Bamboo Toothbrush", price: 120, carbonScore: 5, seller: "Diana" },
      { id: 5, name: "Solar Lamp", price: 1500, carbonScore: 25, seller: "Bob" },
      { id: 6, name: "Compostable Cutlery Set", price: 200, carbonScore: 10, seller: "Diana" },
      { id: 7, name: "Eco Notebook", price: 80, carbonScore: 6, seller: "Bob" },
      { id: 8, name: "Recycled Pen Set", price: 90, carbonScore: 4, seller: "Diana" },
    ];

    const storedFootprints = JSON.parse(localStorage.getItem("footprints")) || [
      { seller: "Bob", score: 75 },
      { seller: "Diana", score: 33 },
    ];

    setUsers(storedUsers);
    setProducts(storedProducts);
    setFootprints(storedFootprints);

    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("products", JSON.stringify(storedProducts));
    localStorage.setItem("footprints", JSON.stringify(storedFootprints));
  }, []);

  // User management actions
  const approveUser = (id) => updateUserStatus(id, "active");
  const blockUser = (id) => updateUserStatus(id, "blocked");
  const deleteUser = (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };
  const updateUserStatus = (id, status) => {
    const updated = users.map(u => u.id === id ? { ...u, status } : u);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const saveUser = () => {
    if(userForm.id) {
      const updated = users.map(u => u.id === userForm.id ? userForm : u);
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
    } else {
      const newUser = { ...userForm, id: Date.now() };
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
    }
    setUserForm({ name: "", role: "Customer", status: "active", id: null });
  };

  const editUser = (u) => setUserForm(u);

  // Cart actions
  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  const checkout = () => {
    if(cart.length === 0) return alert("Cart is empty!");
    const totalCO2 = cart.reduce((s,p)=>s+p.carbonScore,0);
    alert(`Checked out ${cart.length} items!\nTotal CO₂: ${totalCO2} kg`);
    setCart([]);
  };

  const renderContent = () => {
    switch(tab) {
      case "users":
        return (
          <div className="tab-section">
            <h2>👥 Manage Users</h2>
            <div className="user-form">
              <h3>{userForm.id ? "Edit User" : "Add User"}</h3>
              <input 
                type="text" placeholder="Name" 
                value={userForm.name} 
                onChange={(e)=>setUserForm({...userForm, name: e.target.value})} 
              />
              <select value={userForm.role} onChange={(e)=>setUserForm({...userForm, role: e.target.value})}>
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
              </select>
              <button className="btn-green" onClick={saveUser}>{userForm.id ? "Update" : "Add"}</button>
            </div>

            <ul className="user-list">
              {users.map(u => (
                <li key={u.id}>
                  {u.name} - {u.role} - Status: {u.status}
                  {u.status === "pending" && <button className="btn-green" onClick={() => approveUser(u.id)}><FaCheck /> Approve</button>}
                  {u.status === "active" && <button className="btn-green" onClick={() => blockUser(u.id)}><FaBan /> Block</button>}
                  <button className="btn-green" onClick={() => editUser(u)}><FaEdit /> Edit</button>
                  <button className="btn-green" onClick={() => deleteUser(u.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "products":
        return (
          <div className="tab-section">
            <h2>📦 Browse Products</h2>
            <ul className="product-list">
              {products.map(p => (
                <li key={p.id}>
                  {p.name} by {p.seller} — ₹{p.price} — Carbon: {p.carbonScore} kg
                  <button className="btn-green" onClick={()=>addToCart(p)}><FaShoppingCart /> Buy</button>
                </li>
              ))}
            </ul>
            <div style={{marginTop:"15px"}}>
              <strong>Cart:</strong> {cart.length} items
              <button className="btn-green" onClick={checkout} style={{marginLeft:"10px"}}>Checkout</button>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="tab-section">
            <h2>📈 Carbon Footprint Analytics</h2>
            <BarChart width={500} height={300} data={footprints}>
              <XAxis dataKey="seller" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#16a34a" />
            </BarChart>
            <PieChart width={400} height={300}>
              <Pie data={footprints} dataKey="score" nameKey="seller" outerRadius={100} label>
                {footprints.map((entry, index) => (
                  <Cell key={`c-${index}`} fill={["#4ade80", "#16a34a", "#065f46"][index % 3]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        );
      default:
        return <p>Welcome Admin!</p>;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2><FaUserShield /> Admin</h2>
        <ul>
          <li className={tab==="users"?"active":""} onClick={() => setTab("users")}><FaUsers /> Users</li>
          <li className={tab==="products"?"active":""} onClick={() => setTab("products")}><FaBox /> Products / Shop</li>
          <li className={tab==="analytics"?"active":""} onClick={() => setTab("analytics")}><FaChartPie /> Carbon Analytics</li>
        </ul>
      </aside>
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}
