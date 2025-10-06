import React, { useState, useRef, useEffect } from "react";
import "../App.css";

const Browse = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const [showForm, setShowForm] = useState(false); // NEW
    const [topLocation, setTopLocation] = useState("");

    const gridRef = useRef();
    const buttonRef = useRef();
    const MAX_RESULTS = 40;

    // Fetch top location for current user (example userId=1)
    useEffect(() => {
        fetch(`/api/users/1/top-location`)
            .then((res) => res.json())
            .then((data) => setTopLocation(data.location || ""))
            .catch(console.error);
    }, []);

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            try {
                const query = encodeURIComponent(searchQuery.trim());
                const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${MAX_RESULTS}&printType=books&langRestrict=en&orderBy=relevance`;

                const res = await fetch(url);
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
                        (info.industryIdentifiers || []).find(
                            (id) => id.type === "ISBN_13"
                        )?.identifier || null;

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

    const handleBookClick = (book) => {
        if (!gridRef.current) return;
        const gridRect = gridRef.current.getBoundingClientRect();

        setCardStyle({
                         top: gridRect.top + window.scrollY,
                         left: gridRect.right + window.scrollX + 10,
                         height: gridRect.height,
                     });

        setSelectedBook(book);
        setShowForm(false); // Reset to description when switching books
    };

    // Close info card if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!gridRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) {
                setSelectedBook(null);
                setShowForm(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="app-container">
            <div className="page-title dm-mono-regular-italic">
                <h1>BROWSE</h1>
            </div>

            <div className="page-body">
                <div className="browse-grid" ref={gridRef}>
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="book-item"
                            onClick={() => handleBookClick(book)}
                        >
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
                    <div className="browse-info-card" style={cardStyle}>
                        <div className="info-card-content">
                            <h2 className="dm-mono-medium-italic">{selectedBook.title}</h2>
                            <h3 className="dm-mono-light-italic">
                                {selectedBook.authors?.join(", ")}
                            </h3>

                            {!showForm ? (
                                // Show description
                                <p className="dm-mono-light">{selectedBook.description}</p>
                            ) : (
                                 // Show form instead of description
                                 <form className="add-form">
                                     <input
                                         type="text"
                                         placeholder="Location"
                                         defaultValue={topLocation}
                                     />
                                     <input
                                         type="date"
                                         placeholder="Bought on"
                                         defaultValue={new Date().toISOString().split("T")[0]}
                                     />
                                     <button type="submit" className="form-save-btn">
                                         Save
                                     </button>
                                 </form>
                             )}
                        </div>

                        <div className="info-card-footer">
                            <div className="tags">
                                {selectedBook.categories.length > 0 ? (
                                    selectedBook.categories.map((cat, i) => (
                                        <span key={i} className="tag">{cat}</span>
                                    ))
                                ) : (
                                     <span className="tag">Uncategorized</span>
                                 )}
                            </div>

                            {!showForm && (
                                <button
                                    className="info-card-button dm-mono-medium"
                                    onClick={() => setShowForm(true)}
                                    ref = {buttonRef}
                                >
                                    ADD TO LIBRARY
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;
