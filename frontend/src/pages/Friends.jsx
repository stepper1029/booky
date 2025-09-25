import React, { useEffect, useState } from "react";

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const userId = 1;

    // Fetch friends on page load
    useEffect(() => {
        fetch(`/api/friends?userId=${userId}&status=accepted`)
            .then(res => res.json())
            .then(data => {
            setFriends(data);

            if (data.length > 0) {
                setSelectedFriend(data[0]);
            }
        })
            .catch(console.error);
    }, [userId]);



    // Fetch books whenever selectedFriend or searchQuery changes
    useEffect(() => {
        if (!selectedFriend) return;

        // Build query params
        const params = new URLSearchParams({
                                               userId: selectedFriend.id,
                                               search: searchQuery // send search term to backend
                                           });

        fetch(`/api/books/user?${params.toString()}`)
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
    }, [selectedFriend, searchQuery]);

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
                {/* Sidebar (friends list) */}
                <div className="sidebar">
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
                        <div key={book.id} className="book-item">
                            {book.coverUrl ? (
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="book-cover"
                                />
                            ) : (
                                 <div className="book-cover-placeholder">
                                     <p className="book-title">
                                         {book.title} by {book.authorFirstName}{" "}
                                         {book.authorLastName}
                                     </p>
                                 </div>
                             )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Friends;
