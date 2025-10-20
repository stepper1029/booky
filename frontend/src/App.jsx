import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import BrowsePage from "./pages/Browse";
import LocationsPage from "./pages/Locations";
import FriendsPage from "./pages/Friends";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import Settings from "./pages/Settings";
import { AuthProvider } from "./AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Nav />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/browse" element={<BrowsePage />} />
                    <Route path="/locations" element={<LocationsPage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
