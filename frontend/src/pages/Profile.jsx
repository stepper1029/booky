import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Settings from "./Settings";

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [locationCount, setLocationCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [books, setBooks] = useState([]);
    const [bio, setBio] = useState("");

    useEffect(() => {
        if (!user?.username || !user?.token) return;

        const fetchUser = async () => {
            try {
                console.log("Fetching user by username:", user.username);
                const res = await fetch(
                    `/api/users/byUsername?username=${encodeURIComponent(user.username)}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                if (!res.ok) throw new Error(`Failed to fetch user: HTTP ${res.status}`);
                const data = await res.json();
                console.log("Fetched user object:", data);
                setUserId(data.id); // ✅ set userId here
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, [user]); // only depends on `user`



    // Fetch counts
    useEffect(() => {
        if (!userId || !user?.token) {
            console.log("⏳ Waiting for userId or token...");
            return;
        }

        const headers = { Authorization: `Bearer ${user.token}` };

        const fetchCounts = async () => {
            try {
                console.log("Fetching counts for userId:", userId);

                const [locRes, bookRes, friendRes] = await Promise.all([
                                                                           fetch(`/api/locations/count?userId=${userId}`, { headers }),
                                                                           fetch(`/api/books/count/user?userId=${userId}`, { headers }),
                                                                           fetch(`/api/friends/count?userId=${userId}`, { headers }),
                                                                       ]);

                if (!locRes.ok || !bookRes.ok || !friendRes.ok) {
                    console.error("One of the count requests failed");
                    return;
                }

                const [locData, bookData, friendData] = await Promise.all([
                                                                              locRes.json(),
                                                                              bookRes.json(),
                                                                              friendRes.json(),
                                                                          ]);

                setLocationCount(Number(locData));
                setBookCount(Number(bookData));
                setFriendCount(Number(friendData));
            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        };

        fetchCounts();
    }, [userId, user?.token]);

// Fetch top books
    useEffect(() => {
        if (!userId || !user?.token) return;

        const fetchTopBooksAndCovers = async () => {
            try {
                const topRes = await fetch(`/api/users/topFour?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (!topRes.ok) {
                    console.error("Failed to fetch top books:", topRes.status);
                    return;
                }

                const topIsbns = (await topRes.json()).filter(Boolean);
                if (!topIsbns.length) return setBooks([]);

                const covers = await Promise.all(
                    topIsbns.map(async (isbn) => {
                        try {
                            const res = await fetch(
                                `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
                            );
                            if (!res.ok) return { isbn, coverUrl: "" };

                            const data = await res.json();
                            const coverUrl = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || "";
                            return { isbn, coverUrl };
                        } catch {
                            return { isbn, coverUrl: "" };
                        }
                    })
                );

                setBooks(covers);
            } catch (err) {
                console.error("Error fetching top books:", err);
            }
        };

        fetchTopBooksAndCovers();
    }, [userId, user?.token]);

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



    const pluralize = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

    const handleSignOut = () => {
        logout();
        navigate("/login");
    };

    const handleSettings = () => {
        navigate("/settings");
    };

    return (
        <div className="app-container">
            <div className="profile-container">
            <div className="profile-header">
                <div className="profile-page-title dm-mono-regular-italic">
                    <h1>PROFILE</h1>
                </div>
                <div className="username dm-mono-medium">
                    <p>{user?.username}</p>
                </div>
            </div>
                <p className="bio">{bio}</p>
            <div className="split">
                <div className="profile-left dm-mono-regular">
                    <p>{pluralize(bookCount, "book", "books")}</p>
                    <p>{pluralize(locationCount, "location", "locations")}</p>
                    <p>{pluralize(friendCount, "friend", "friends")}</p>
                </div>
                <div className="profile-right dm-mono-regular">
                    {books.map((book) => (
                        <div key={book.isbn} className="profile-book-item">
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.isbn} className="book-cover" />
                            ) : (
                                 <p>{book.isbn}</p>
                             )}
                        </div>
                    ))}
                </div>
            </div>
                <div className="absolute bottom-5 right-5 flex items-center space-x-4">
                    <button onClick={handleSignOut} className="signout-button">
                        SIGN OUT
                    </button>
                    <button onClick={handleSettings} className="settings-button">
                        SETTINGS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
