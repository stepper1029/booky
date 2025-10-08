import React, { useEffect, useState, useRef } from "react";

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedBookLocation, setSelectedBookLocation] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const sidebarRef = useRef();
    const userId = 1;

    // Fetch friends
    useEffect(() => {
        fetch(`/api/friends?userId=${userId}&status=accepted`)
            .then((res) => res.json())
            .then((data) => {
                setFriends(data);
                if (data.length > 0) setSelectedFriend(data[0]);
            })
            .catch(console.error);
    }, [userId]);

    // Fetch books whenever selectedFriend or searchQuery changes
    useEffect(() => {
        if (!selectedFriend) return;

        const params = new URLSearchParams({
                                               userId: selectedFriend.id,
                                               search: searchQuery,
                                           });

        fetch(`/api/books/user?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                const coverPromises = data.map(async (book) => {
                    if (!book.isbn) return { ...book, coverUrl: "", description: "" };
                    try {
                        const googleRes = await fetch(
                            `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(book.isbn)}`
                        );
                        const googleData = await googleRes.json();
                        const volumeInfo = googleData.items?.[0]?.volumeInfo || {};
                        const thumbnail = volumeInfo.imageLinks?.thumbnail || "";
                        const description = volumeInfo.description || "No description available.";
                        return { ...book, coverUrl: thumbnail, description };
                    } catch (e) {
                        console.error("Error fetching Google cover:", e);
                        return { ...book, coverUrl: "", description: "No description available." };
                    }
                });
                return Promise.all(coverPromises);
            })
            .then((booksWithCovers) => setBooks(booksWithCovers))
            .catch(console.error);
    }, [selectedFriend, searchQuery]);


    const handleBookClick = async (book) => {
        if (!sidebarRef.current) return;

        const sidebarRect = sidebarRef.current.getBoundingClientRect();

        setCardStyle({
                         top: sidebarRect.top + window.scrollY,       // align top with sidebar
                         left: sidebarRect.left + window.scrollX,     // align left with sidebar
                     });

        setSelectedBook(book);
        setSelectedBookLocation(null); // reset while fetching

        // Fetch location name by ID
        if (book.locationId) {
            try {
                const res = await fetch(`/api/locations/name?locationId=${book.locationId}`);
                if (!res.ok) throw new Error("Failed to fetch location");
                const locationName = await res.text(); // use text() instead of json()
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
            {/* Header */}
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

            {/* Body */}
            <div className="page-body">
                {/* Sidebar */}
                <div className="sidebar" ref={sidebarRef}>
                    {friends.map((friend) => (
                        <p
                            key={friend.id}
                            className={selectedFriend?.id === friend.id ? 'active-location' : ''}
                            onClick={() => setSelectedFriend(friend)}
                        >
                            {friend.username}
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
                                     <p className="book-title">{book.title} by {book.author}</p>
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
                                {selectedBook.author}
                            </h3>
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
