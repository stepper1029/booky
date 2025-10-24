import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedBookLocation, setSelectedBookLocation] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const [userId, setUserId] = useState(null);

    const { user } = useAuth();
    const sidebarRef = useRef();

    // Fetch current user to get userId
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

    // Fetch friends once we have userId
    useEffect(() => {
        if (!userId || !user?.token) return;

        const fetchFriends = async () => {
            try {
                const res = await fetch(`/api/friends?userId=${userId}&status=accepted`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch friends");
                const data = await res.json();
                setFriends(data);
                if (data.length > 0) setSelectedFriend(data[0]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFriends();
    }, [userId, user]);

    // Fetch books of selected friend
    useEffect(() => {
        if (!selectedFriend || !user?.token) return;

        const fetchBooks = async () => {
            try {
                const params = new URLSearchParams({
                                                       userId: selectedFriend.id,
                                                       search: searchQuery,
                                                   });

                const res = await fetch(`/api/books/user?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch books");
                const data = await res.json();

                // Fetch Google Book covers and descriptions
                const booksWithCovers = await Promise.all(
                    data.map(async (book) => {
                        if (!book.isbn) return { ...book, coverUrl: "", description: "" };
                        try {
                            const googleRes = await fetch(
                                `/api/books/search?query=isbn:${encodeURIComponent(book.isbn)}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${user?.token}`,
                                    },
                                }
                            );
                            const googleData = await googleRes.json();
                            const volumeInfo = googleData.items?.[0]?.volumeInfo || {};
                            const thumbnail = volumeInfo.imageLinks?.thumbnail || "";
                            const description = volumeInfo.description || "No description available.";
                            return { ...book, coverUrl: thumbnail, description };
                        } catch {
                            return { ...book, coverUrl: "", description: "No description available." };
                        }
                    }));


                setBooks(booksWithCovers);
            } catch (err) {
                console.error(err);
                setBooks([]);
            }
        };

        fetchBooks();
    }, [selectedFriend, searchQuery, user]);

    // Handle book click for info card
    const handleBookClick = async (book) => {
        if (!sidebarRef.current) return;

        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        setCardStyle({
                         top: sidebarRect.top + window.scrollY,
                         left: sidebarRect.left + window.scrollX,
                     });

        setSelectedBook(book);
        setSelectedBookLocation(null);

        if (book.locationId) {
            try {
                const res = await fetch(`/api/locations/name?locationId=${book.locationId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch location");
                const locationName = await res.text();
                setSelectedBookLocation(locationName);
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Close info card if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!sidebarRef.current?.contains(e.target)) {
                setSelectedBook(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="page-title dm-mono-regular-italic">
                    <h1>FRIENDS</h1>
                </div>
                <div className="header-search">
                    <input
                        type="text"
                        placeholder="title or author"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input dm-mono-regular-italic"
                    />
                </div>
            </div>

            <div className="page-body">
                <div className="sidebar" ref={sidebarRef}>
                    {friends.map((friend) => (
                        <p
                            key={friend.id}
                            className={selectedFriend?.id === friend.id ? "active-location" : ""}
                            onClick={() => setSelectedFriend(friend)}
                        >
                            {friend.username}
                        </p>
                    ))}
                </div>

                <div className="book-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-item" onClick={() => handleBookClick(book)}>
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                            ) : (
                                 <div className="book-cover-placeholder">
                                     <p className="book-title">{book.title} by {book.author}</p>
                                 </div>
                             )}
                        </div>
                    ))}
                </div>

                {selectedBook && (
                    <div className="info-card" style={cardStyle}>
                        <h2 className="dm-mono-medium-italic">{selectedBook.title}</h2>
                        <h3 className="dm-mono-light-italic">{selectedBook.author}</h3>
                        <p className="dm-mono-light">{selectedBook.description}</p>
                        {selectedBook.locationId && (
                            <div className="owner-tag-wrapper">
                                <span className="owner-tag">{selectedBookLocation}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
