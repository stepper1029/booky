import React, { useEffect, useState } from "react";

const Profile = () => {
    const [locationCount, setLocationCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [username, setUsername] = useState("");
    const userId = 1;

    const fetchJSON = async (url, setter) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch ${url}`);
            const data = await res.json();
            setter(Number(data));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchText = async (url, setter) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch ${url}`);
            const data = await res.text();
            setter(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJSON(`/api/locations/count?userId=${userId}`, setLocationCount);
        fetchJSON(`/api/books/count/user?userId=${userId}`, setBookCount);
        fetchJSON(`/api/friends/count?userId=${userId}`, setFriendCount);
        fetchText(`/api/users/username?userId=${userId}`, setUsername);
    }, [userId]);

    const pluralize = (count, singular, plural) =>
        `${count} ${count === 1 ? singular : plural}`;

    return (
        <div className="app-container">
            <div className="profile-header">
                <div className="page-title dm-mono-regular-italic">
                    <h1>PROFILE</h1>
                </div>
                <div className="username dm-mono-medium">
                    <p>{username}</p>
                </div>
            </div>
            <div className="split">
                <div className="profile-left dm-mono-regular">
                    <p>{pluralize(bookCount, "book", "books")}</p>
                    <p>{pluralize(locationCount, "location", "locations")}</p>
                    <p>{pluralize(friendCount, "friend", "friends")}</p>
                </div>
                <div className="profile-right"></div>
            </div>
        </div>
    );
};

export default Profile;
