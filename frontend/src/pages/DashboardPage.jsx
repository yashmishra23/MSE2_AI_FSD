import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const emptyItem = {
  itemName: "",
  description: "",
  type: "Lost",
  location: "",
  date: "",
  contactInfo: "",
};

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    localStorage.removeItem("user");
    return {};
  }
};

const formatItemDate = (value) => {
  if (!value) {
    return "Date not provided";
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Date not provided" : parsed.toLocaleDateString();
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useMemo(() => readStoredUser(), []);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItems = async (query = "", type = "") => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (query) {
        params.set("name", query);
      }

      if (type) {
        params.set("type", type);
      }

      const endpoint = params.toString() ? `/items/search?${params.toString()}` : "/items";
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyItem);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, form);
        setMessage("Item updated successfully.");
      } else {
        await api.post("/items", form);
        setMessage("Item added successfully.");
      }

      resetForm();
      fetchItems(searchTerm, searchType);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save item.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: item.date?.slice(0, 10) || "",
      contactInfo: item.contactInfo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setError("");
    setMessage("");

    try {
      await api.delete(`/items/${id}`);
      setMessage("Item deleted successfully.");
      fetchItems(searchTerm, searchType);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete item.");
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    fetchItems(searchTerm, searchType);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Lost & Found System</p>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome, {user.name || "Student"}</p>
        </div>
        <button className="secondary-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="panel">
          <h2>{editingId ? "Update Item" : "Add Item"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Item Name
              <input name="itemName" value={form.itemName} onChange={handleChange} placeholder="Wallet" />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Black wallet with student ID card"
              />
            </label>

            <label>
              Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Library first floor"
              />
            </label>

            <label>
              Date
              <input type="date" name="date" value={form.date} onChange={handleChange} />
            </label>

            <label>
              Contact Info
              <input
                name="contactInfo"
                value={form.contactInfo}
                onChange={handleChange}
                placeholder="9876543210 / email"
              />
            </label>

            {error ? <p className="message error">{error}</p> : null}
            {message ? <p className="message success">{message}</p> : null}

            <div className="button-row">
              <button type="submit" className="primary-button">
                {editingId ? "Update Item" : "Add Item"}
              </button>
              {editingId ? (
                <button type="button" className="secondary-button" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Reported Items</h2>
              <p className="subtitle">Search, review, edit, and delete your entries.</p>
            </div>
            <form onSubmit={handleSearch} className="search-bar">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by item name"
              />
              <select value={searchType} onChange={(event) => setSearchType(event.target.value)}>
                <option value="">All Types</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
              <button type="submit" className="primary-button">
                Search
              </button>
            </form>
          </div>

          {loading ? <p className="message">Loading items...</p> : null}

          <div className="item-list">
            {items.length === 0 && !loading ? <p className="message">No items found.</p> : null}

            {items.map((item) => {
              const isOwner = item.owner?._id === user.id;

              return (
                <article key={item._id} className="item-card">
                  <div className="item-meta">
                    <span className={`badge ${item.type === "Found" ? "found" : "lost"}`}>{item.type}</span>
                    <span>{formatItemDate(item.date)}</span>
                  </div>

                  <h3>{item.itemName}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>Location:</strong> {item.location}
                  </p>
                  <p>
                    <strong>Contact:</strong> {item.contactInfo}
                  </p>
                  <p>
                    <strong>Reported by:</strong> {item.owner?.name || "Unknown"}
                  </p>

                  {isOwner ? (
                    <div className="button-row">
                      <button className="secondary-button" onClick={() => handleEdit(item)}>
                        Update
                      </button>
                      <button className="danger-button" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
