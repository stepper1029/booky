import React, { useEffect, useState, useRef } from "react";
import {useAuth} from "../AuthContext";
import API_BASE_URL from "../config";

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const sidebarRef = useRef();
    const [userId, setUserId] = useState(null);
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

    // Fetch locations
    useEffect(() => {
        if (!userId || !user?.token) return;

        fetch(`${API_BASE_URL}/api/locations?userId=${userId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setLocations(data);
                if (data.length > 0) setSelectedLocation(data[0]);
            })
            .catch(console.error);
    }, [userId, user.token]);

    // Fetch books and get description from Google Books
    useEffect(() => {
        if (!selectedLocation) return;

        const params = new URLSearchParams({
                                               locationId: selectedLocation.id,
                                               search: searchQuery,
                                           });

        fetch(`${API_BASE_URL}/api/books/location?${params.toString()}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const bookPromises = data.map(async (book) => {
                    if (!book.isbn) return { ...book, coverUrl: "", description: "No description available." };

                    try {
                        const googleRes = await fetch(
                            `${API_BASE_URL}/api/books/search?query=isbn:${encodeURIComponent(book.isbn)}`,  {headers: { Authorization: `Bearer ${user?.token}` },}
                        );
                        const googleData = await googleRes.json();
                        const volumeInfo = googleData.items?.[0]?.volumeInfo || {};
                        const thumbnail = volumeInfo.imageLinks?.thumbnail || "";
                        const description = volumeInfo.description || "No description available.";
                        return { ...book, coverUrl: thumbnail, description };
                    } catch (e) {
                        console.error("Error fetching Google data:", e);
                        return { ...book, coverUrl: "", description: "No description available." };
                    }
                });

                return Promise.all(bookPromises);
            })
            .then((booksWithData) => setBooks(booksWithData))
            .catch(console.error);
    }, [selectedLocation, searchQuery, user.token]);

    const handleBookClick = (book) => {
        if (!sidebarRef.current) return;
        const sidebarRect = sidebarRef.current.getBoundingClientRect();

        setCardStyle({
                         top: sidebarRect.top + window.scrollY,
                         left: sidebarRect.left + window.scrollX,
                     });

        setSelectedBook(book);
    };

    // Close info card when clicking outside
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
            {/* Header */}
            <div className="page-header">
                <div className="page-title dm-mono-regular-italic">
                    <h1>LOCATIONS</h1>
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

            {/* Body */}
            <div className="page-body">
                {/* Sidebar */}
                <div className="sidebar" ref={sidebarRef}>
                    {locations.map((loc) => (
                        <p
                            key={loc.id}
                            className={selectedLocation?.id === loc.id ? "active-location" : ""}
                            onClick={() => setSelectedLocation(loc)}
                        >
                            {loc.name}
                        </p>
                    ))}
                </div>

                {/* Book grid */}
                <div className="book-grid">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="book-item"
                            onClick={() => handleBookClick(book)}
                        >
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                            ) : (
                                 <div className="book-cover-placeholder">
                                     <p className="book-title">
                                         {book.title} by {book.authors}
                                     </p>
                                 </div>
                             )}
                        </div>
                    ))}
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

export default Locations;
