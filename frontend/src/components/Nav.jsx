import React from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";
import "../App.css";

const Nav = () => {
    return (
        <nav className="nav">
            <div className="nav-left">
                <h1 className="dm-mono-regular">BOOKY</h1>
            </div>
            <div className="nav-right dm-mono-regular">
                <NavLink
                    to="/browse"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    BROWSE
                </NavLink>
                <NavLink
                    to="/locations"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    LOCATIONS
                </NavLink>
                <NavLink
                    to="/friends"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    FRIENDS
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    PROFILE
                </NavLink>
            </div>
        </nav>
    );
};

export default Nav;
