import React, { useState, useRef, useEffect } from "react";
import "../App.css";

const Browse = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [cardStyle, setCardStyle] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [topLocation, setTopLocation] = useState();
    const [locations, setLocations] = useState([]);
    const [owners, setOwners] = useState([]);

    const gridRef = useRef();
    const buttonRef = useRef();
    const infoCardRef = useRef();
    const MAX_RESULTS = 40;

    useEffect(() => {
        fetch(`/api/locations?userId=1`)
            .then((res) => res.json())
            .then((data) => {
                setLocations(data);
                setTopLocation(data?.[0]?.name || "");
            })
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
        setOwners([]); // Reset owners while fetching

        try {
            const res = await fetch(`/api/books/owners?isbn=${encodeURIComponent(book.isbn13)}`);
            console.log(book.isbn13)
            if (!res.ok) throw new Error("Failed to fetch owners");
            const data = await res.json();
            setOwners(data.owners || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Close info card if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                !gridRef.current?.contains(e.target) &&
                !infoCardRef.current?.contains(e.target)
            ) {
                setSelectedBook(null);
                setShowForm(false);
                setOwners([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            userId: 1,
            dateAdded: new Date().toISOString().split("T")[0],
            blurb: selectedBook.description,
        };

        try {
            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to add book");
            setShowForm(false);
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
                    <div className="browse-info-card" style={cardStyle} ref={infoCardRef}>
                        <div className="info-card-content">
                            <h2 className="dm-mono-medium-italic">{selectedBook.title}</h2>
                            <h3 className="dm-mono-light-italic">
                                {selectedBook.authors?.join(", ")}
                            </h3>

                            {!showForm ? (
                                <p className="dm-mono-light">{selectedBook.description}</p>
                            ) : (
                                 <form className="add-form" onSubmit={handleAddBook}>
                                     <div className="select-wrapper">
                                         <select name="location" defaultValue={topLocation}>
                                             {locations.map((loc) => (
                                                 <option key={loc.id} value={loc.name}>{loc.name}</option>
                                             ))}
                                         </select>
                                         <div className="custom-caret">▼</div>
                                     </div>

                                     <input
                                         type="date"
                                         name="boughtOn"
                                         defaultValue={new Date().toISOString().split("T")[0]}
                                     />

                                     <button type="submit" className="form-save-btn">SAVE</button>
                                 </form>
                             )}
                        </div>

                        {!showForm && (
                            <div className="info-card-footer">
                                <div className="tags">
                                    {selectedBook.categories.length > 0 ? (
                                        selectedBook.categories.map((cat, i) => (
                                            <span key={i} className="tag">{cat}</span>
                                        ))
                                    ) : (
                                         <span className="tag">Uncategorized</span>
                                     )}

                                    {/* Owners tags */}
                                    {owners.map((owner, i) => (
                                        <span key={`owner-${i}`} style={{ border: '1px solid red', padding: '2px', marginRight: '4px' }}>
    {owner.username} - {owner.location}
</span>

                                    ))}
                                </div>
                                <button
                                    className="info-card-button dm-mono-medium"
                                    onClick={() => setShowForm(true)}
                                    ref={buttonRef}
                                >
                                    ADD TO LIBRARY
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;
