import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import BrowsePage from "./pages/Browse";
import LocationsPage from "./pages/Locations";
import FriendsPage from "./pages/Friends";
import ProfilePage from "./pages/Profile";

function App() {
    return (
        <div className="app-container">
        <Router>
            <Nav />
            <Routes>
                {/* Default redirect to /browse */}
                <Route path="/" element={<Navigate to="/browse" />} />

                {/* Routes for each page */}
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
        </div>
    );
}

export default App;
