import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import { useAuth } from "../AuthContext";

const Browse = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [topLocation, setTopLocation] = useState();
    const [locations, setLocations] = useState([]);
    const [owners, setOwners] = useState([]);
    const [userId, setUserId] = useState(null);

    const { user } = useAuth();
    const gridRef = useRef();
    const buttonRef = useRef();
    const infoCardRef = useRef();
    const MAX_RESULTS = 40;

    // Fetch user object first to get userId
    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.username || !user?.token) return;
            try {
                const res = await fetch(
                    `/api/users/byUsername?username=${encodeURIComponent(user.username)}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
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

    // Fetch locations once we have userId
    useEffect(() => {
        const fetchLocations = async () => {
            if (!userId || !user?.token) return;
            try {
                const res = await fetch(`/api/locations?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
                const data = await res.json();
                setLocations(data);
                setTopLocation(data?.[0]?.name || "");
            } catch (err) {
                console.error("Failed to fetch locations:", err);
            }
        };
        fetchLocations();
    }, [userId, user?.token]);

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            try {
                const query = encodeURIComponent(searchQuery.trim());
                // Call your backend endpoint
                const url = `/api/books/search?query=${query}`;
                const res = await fetch(url, {headers: { Authorization: `Bearer ${user?.token}` },});
                if (!res.ok) throw new Error("Failed to fetch search results");
                const data = await res.json();

                if (!data.items) {
                    setBooks([]);
                    return;
                }

                const booksWithCovers = data.items.map((item) => {
                    const info = item.volumeInfo || {};
                    const imageLinks = info.imageLinks || {};
                    const isbn13 =
                        (info.industryIdentifiers || []).find((id) => id.type === "ISBN_13")
                            ?.identifier || null;
                    return {
                        id: item.id,
                        title: info.title || "",
                        authors: info.authors || [],
                        thumbnail: imageLinks.thumbnail || null,
                        description: info.description || "No description available.",
                        isbn13,
                        categories: info.categories || [],
                    };
                });

                setBooks(booksWithCovers);
            } catch (err) {
                console.error(err);
                setBooks([]);
            }
        }
    };


    // Fetch owners for a book
    const fetchOwners = async (book) => {
        if (!book?.isbn13) return;
        try {
            const res = await fetch(`/api/books/owners?isbn=${encodeURIComponent(book.isbn13)}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch owners");
            const data = await res.json();
            console.log(data.owners);
            setOwners(data.owners || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Click book → show info card
    const handleBookClick = async (book) => {
        if (!gridRef.current) return;
        const gridRect = gridRef.current.getBoundingClientRect();

        setCardStyle({
                         top: gridRect.top + window.scrollY,
                         left: gridRect.right + window.scrollX + 10,
                         height: gridRect.height,
                     });

        setSelectedBook(book);
        setShowForm(false);
        setOwners([]); // Reset owners
        await fetchOwners(book);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!gridRef.current?.contains(e.target) && !infoCardRef.current?.contains(e.target)) {
                setSelectedBook(null);
                setShowForm(false);
                setOwners([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Add book to user’s library
    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!selectedBook) return;

        const formData = new FormData(e.target);
        const locationName = formData.get("location");
        const boughtOn = formData.get("boughtOn");

        const locationObj = locations.find((loc) => loc.name === locationName);
        if (!locationObj) {
            alert("Invalid location selected.");
            return;
        }

        const payload = {
            isbn: selectedBook.isbn13,
            title: selectedBook.title,
            author: selectedBook.authors?.[0] || "",
            locationId: locationObj.id,
            dateAdded: boughtOn,
            blurb: selectedBook.description,
            userId: userId,
        };

        try {
            const res = await fetch(`/api/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to add book");
            setShowForm(false);

            // 🔄 Refresh owners so UI updates immediately
            await fetchOwners(selectedBook);
        } catch (err) {
            console.error(err);
            alert("Error adding book. Try again.");
        }
    };

    return (
        <div className="app-container">
            <div className="page-title dm-mono-regular-italic">
                <h1>BROWSE</h1>
            </div>

            <div className="page-body">
                <div className="browse-grid" ref={gridRef}>
                    {books.map((book) => (
                        <div key={book.id} className="book-item" onClick={() => handleBookClick(book)}>
                            {book.thumbnail ? (
                                <img src={book.thumbnail} alt={book.title} className="book-cover" />
                            ) : (
                                 <div className="book-cover-placeholder">
                                     <p className="book-title">{book.title}</p>
                                     <p className="book-authors">{book.authors?.join(", ")}</p>
                                 </div>
                             )}
                        </div>
                    ))}
                </div>

                <div className="browse-search">
                    <input
                        type="text"
                        placeholder="title or author"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="search-input dm-mono-regular-italic"
                    />
                </div>

                {selectedBook && (
                    <div className="browse-info-card" style={cardStyle} ref={infoCardRef}>
                        <div className="info-card-content">
                            <h2 className="dm-mono-medium-italic">{selectedBook.title}</h2>
                            <h3 className="dm-mono-light-italic">{selectedBook.authors?.join(", ")}</h3>

                            {!showForm ? (
                                <p className="dm-mono-light">{selectedBook.description}</p>
                            ) : (
                                 <form className="add-form" onSubmit={handleAddBook}>
                                     <div className="select-wrapper">
                                         <select name="location" defaultValue={topLocation}>
                                             {locations.map((loc) => (
                                                 <option key={loc.id} value={loc.name}>
                                                     {loc.name}
                                                 </option>
                                             ))}
                                         </select>
                                         <div className="custom-caret">▼</div>
                                     </div>

                                     <input
                                         type="date"
                                         name="boughtOn"
                                         defaultValue={new Date().toISOString().split("T")[0]}
                                     />

                                     <button type="submit" className="form-save-btn">
                                         SAVE
                                     </button>
                                 </form>
                             )}
                        </div>

                        {!showForm && (
                            <div className="info-card-footer">
                                <div className="tags">
                                    {selectedBook.categories.length > 0
                                     ? selectedBook.categories.map((cat, i) => (
                                            <span key={i} className="tag">
                                                  {cat}
                                              </span>
                                        ))
                                     : (
                                         <span className="tag">Uncategorized</span>
                                     )}

                                    {owners.map((owner, i) => (
                                        <span key={`owner-${i}`} className="owner-tag">
                                            {owner.username} - {owner.location}
                                        </span>
                                    ))}
                                </div>

                                {!owners.some((o) => o.userId === userId) && (
                                    <button
                                        className="info-card-button dm-mono-medium"
                                        onClick={() => setShowForm(true)}
                                        ref={buttonRef}
                                    >
                                        ADD TO LIBRARY
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;
