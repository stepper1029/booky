import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [userId, setUserId] = useState(null);
    const [locationCount, setLocationCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (!user) {return;}
        if (!user.username || !user.token) {
            console.log("userAuth exists but missing username or token:", user);
            return;
        }

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
                setUserId(data.id);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, [user]);


    useEffect(() => {
        if (!user || !user?.token) return;

        const headers = { Authorization: `Bearer ${user.token}` };

        const fetchCounts = async () => {
            try {
                console.log("Fetching counts for userId:", userId);

                const [locRes, bookRes, friendRes] = await Promise.all([
                                                                           fetch(`/api/locations/count?userId=${userId}`, { headers }),
                                                                           fetch(`/api/books/count/user?userId=${userId}`, { headers }),
                                                                           fetch(`/api/friends/count?userId=${userId}`, { headers }),
                                                                       ]);

                console.log("Locations count response status:", locRes.status);
                console.log("Books count response status:", bookRes.status);
                console.log("Friends count response status:", friendRes.status);

                const [locData, bookData, friendData] = await Promise.all([
                                                                              locRes.json(),
                                                                              bookRes.json(),
                                                                              friendRes.json(),
                                                                          ]);

                console.log("Locations count data:", locData);
                console.log("Books count data:", bookData);
                console.log("Friends count data:", friendData);

                setLocationCount(Number(locData));
                setBookCount(Number(bookData));
                setFriendCount(Number(friendData));
            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        };

        fetchCounts();
    }, [userId, user]);

    useEffect(() => {
        if (!userId || !user?.token) return;

        const fetchTopBooksAndCovers = async () => {
            console.log("attempting to fetch top four");
            try {
                const topRes = await fetch(`/api/users/getTopFour?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!topRes.ok) {
                    console.error("Failed to fetch top four books:", topRes.status);
                    return;
                }

                const topIsbns = (await topRes.json()).filter(Boolean);
                console.log("Top book ISBNs to fetch covers:", topIsbns);

                if (topIsbns.length === 0) {
                    setBooks([]);
                    return;
                }

                const covers = await Promise.all(
                    topIsbns.map(async (isbn) => {
                        try {
                            const res = await fetch(
                                `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`
                            );

                            if (!res.ok) {
                                console.warn(`Google Books API failed for ISBN ${isbn}:`, res.status);
                                return { isbn, coverUrl: "" };
                            }

                            const data = await res.json();
                            const coverUrl = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || "";
                            console.log(`Fetched cover for ISBN ${isbn}:`, coverUrl);

                            return { isbn, coverUrl };
                        } catch (err) {
                            console.error(`Error fetching Google cover for ISBN ${isbn}:`, err);
                            return { isbn, coverUrl: "" };
                        }
                    })
                );

                setBooks(covers);
            } catch (err) {
                console.error("Error fetching top books or covers:", err);
            }
        };

        fetchTopBooksAndCovers();
    }, [userId, user.token]);


    const pluralize = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

    const handleSignOut = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="app-container">
            <div className="profile-header">
                <div className="page-title dm-mono-regular-italic">
                    <h1>PROFILE</h1>
                    <button onClick={handleSignOut} className="signout-button">
                        Sign Out
                    </button>
                </div>
                <div className="username dm-mono-medium">
                    <p>{user?.username}</p>
                </div>
            </div>
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
        </div>
    );
};

export default Profile;
