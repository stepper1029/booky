import React, { useEffect, useState, useRef } from "react";
import {useAuth} from "../AuthContext";
import API_BASE_URL from "../config";

const Settings = () => {
    const tabs = ["Locations", "Friends", "Top Four"];
    const [locations, setLocations] = useState([]);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const sidebarRef = useRef();
    const [userId, setUserId] = useState(null);
    const [bio, setBio] = useState("");
    const [showAddLocationForm, setShowAddLocationForm] = useState(false);
    const [newLocationName, setNewLocationName] = useState("");

    const { user } = useAuth();

    useEffect(() => {
        if (!user?.username || !user?.token) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/users/byUsername?username=${encodeURIComponent(user.username)}`,
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUserId(data.id);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, [user]);

    useEffect(() => {
        if (!userId || !user?.token) return;

        const fetchBio = async () => {
            try {
                console.log("📡 Fetching bio for user:", userId);

                const res = await fetch(`${API_BASE_URL}/api/users/bio?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (!res.ok) {
                    console.log("Failed to fetch bio — status:", res.status);
                    return;
                }

                const bioData = await res.text();
                console.log("Fetched bio for user", userId, ":", bioData);
                setBio(bioData);
            } catch (e) {
                console.error("Error fetching bio for user", userId, e);
            }
        };

        fetchBio();
    }, [userId, user?.token]);

    // Fetch locations
    useEffect(() => {
        if (!userId || !user?.token) return;

        fetch(`${API_BASE_URL}/api/locations?userId=${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setLocations(data);
            })
            .catch(console.error);
    }, [userId, user?.token]);

    const handleAddLocation = async (e) => {
        e.preventDefault();
        if (!newLocationName.trim() || !userId) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/locations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                                         name: newLocationName,
                                         userId: userId
                                     }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Server error:", errorText);
                throw new Error("Failed to add location");
            }

            const newLoc = await res.json();
            console.log("Location added successfully:", newLoc);

            setLocations((prev) => [...prev, newLoc]);
            setNewLocationName("");
            setShowAddLocationForm(false);
        } catch (err) {
            console.error("Error adding location:", err);
            alert("Failed to add location. Please try again.");
        }
    };


    return (
        <div className="app-container">
            <div className="settings-header">
                <div className="profile-page-title dm-mono-regular-italic">
                    <h1>SETTINGS</h1>
                </div>
                <div className="username dm-mono-medium">
                    <p>{user?.username}</p>
                </div>
            </div>
            <p className="bio">{bio}</p>

            {/* Body */}
            <div className="page-body">
                {/* Sidebar */}
                <div className="sidebar" ref={sidebarRef}>
                    {tabs.map((tab) => (
                        <p
                            key={tab}
                            className={selectedTab === tab ? "active-location" : ""}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </p>
                    ))}
                </div>

                <div className="tab-content">
                    {selectedTab === "Locations" && (
                        <div className="locations-list">
                            {locations.length > 0 ? (
                                locations.map((loc) => (
                                    <div key={loc.id} className="location-row">
                                        <h3>{loc.name}</h3>
                                    </div>
                                ))
                            ) : (
                                 <p className="location-row">No locations added yet.</p>
                             )}

                            {/* Popup form */}
                            {showAddLocationForm && (
                                <div className="add-location-form">
                                    <form onSubmit={handleAddLocation}>
                                        <input
                                            type="text"
                                            placeholder="Enter location name"
                                            value={newLocationName}
                                            onChange={(e) => setNewLocationName(e.target.value)}
                                            className="add-location-input dm-mono-regular"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            className="submit-location-button dm-mono-medium"
                                        >
                                            ADD
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Add Location button */}
                            <button
                                className="add-location-button dm-mono-medium"
                                onClick={() => setShowAddLocationForm(!showAddLocationForm)}
                            >
                                {showAddLocationForm ? "CANCEL" : "ADD LOCATION"}
                            </button>
                        </div>
                    )}

                    {selectedTab === "Friends" && (
                        <div className="friends-section">
                            {/* TODO: render friends */}
                            <p>Friends tab content goes here</p>
                        </div>
                    )}

                    {selectedTab === "Top Four" && (
                        <div className="top-books-section">
                            {/* TODO: render top books */}
                            <p>Top Four books content goes here</p>
                        </div>
                    )}
                </div>

                {/* Info card */}
                {selectedBook && (
                    <div className="info-card" style={cardStyle}>
                        <h2 className="dm-mono-medium-italic">{selectedBook.title}</h2>
                        <h3 className="dm-mono-light-italic">
                            {selectedBook.authors}
                        </h3>
                        <p className="dm-mono-light">{selectedBook.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;