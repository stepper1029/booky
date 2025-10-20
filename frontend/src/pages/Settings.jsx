import React, { useEffect, useState, useRef } from "react";
import {useAuth} from "../AuthContext";

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
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.username || !user?.token) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `/api/users/byUsername?username=${encodeURIComponent(user.username)}`,
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

                const res = await fetch(`/api/users/bio?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (!res.ok) {
                    console.log("Failed to fetch bio — status:", res.status);
                    return;
                }

                const bioData = await res.text(); // or res.json() depending on what your endpoint returns
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
        fetch(`/api/locations?userId=${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setLocations(data);
            })
            .catch(console.error);
    }, [userId, user.token]);

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
                            {selectedBook.authorFirstName} {selectedBook.authorLastName}
                        </h3>
                        <p className="dm-mono-light">{selectedBook.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
