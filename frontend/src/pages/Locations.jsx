import React, { useEffect, useState } from "react";

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const userId = 1;

    // Fetch locations on page load
    useEffect(() => {
        fetch(`/api/locations?userId=${userId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch locations");
                return response.json();
            })
            .then((data) => {
                setLocations(data);

                if (data.length > 0) {
                    setSelectedLocation(data[0]); // 👈 pick the first location
                }
            })
            .catch((error) => console.error(error));
    }, [userId]);

    // Whenever selectedLocation  or query changes, fetch books for that location/query
    useEffect(() => {
        if (!selectedLocation) return;

        // Build query params
        const params = new URLSearchParams({
                                               locationId: selectedLocation.id,
                                               search: searchQuery // send search term to backend
                                           });

        fetch(`/api/books/location?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                const coverPromises = data.map((book) =>
                                                   fetch(`/api/books/googlecover?isbn=${book.isbn}`)
                                                       .then((res) => res.ok ? res.text() : "")
                                                       .catch(() => "")
                                                       .then((coverUrl) => ({ ...book, coverUrl }))
                );
                return Promise.all(coverPromises);
            })
            .then((booksWithCovers) => setBooks(booksWithCovers))
            .catch(console.error);
    }, [selectedLocation, searchQuery]); // ✅ re-run when query changes



    return (
        <div className="app-container">
            <div className="page-header dm-mono-regular-italic">
                <div className="page-title">
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

            <div className="page-body">
                {/* Sidebar */}
                <div className="sidebar">
                    {locations.map((loc) => (
                        <p
                            key={loc.id}
                            className={selectedLocation?.id === loc.id ? 'active-location' : ''}
                            onClick={() => setSelectedLocation(loc)}
                        >
                            {loc.name}
                        </p>
                    ))}
                </div>

                {/* Book grid */}
                <div className="book-grid">
                    {books.map((book) => (
                        <div key={book.id} className="book-item">
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                            ) : (
                                 <div className="book-cover-placeholder">
                                     <p className="book-title">{book.title} by {book.authorFirstName} {book.authorLastName}</p>
                                 </div>
                             )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Locations;
