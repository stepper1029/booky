import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../App.css"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        console.log("Attempting login with:", { username, password });

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            console.log("Response status:", res.status);

            const text = await res.text();
            console.log("Response body:", text);

            if (!res.ok) {
                throw new Error(text || "Failed to sign in");
            }

            const token = text; // backend returns JWT as plain string
            console.log("Received JWT token:", token);

            console.log("Setting userAuth in context:", { username, token });
            login({ username, token });

            navigate("/browse");
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid username or password");
        }
    };

    return (
        <div className="app-container">
            <div className="login-container">
                <h2 className="login-header dm-mono-medium-italic">SIGN IN</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">LOGIN</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
