import React, { useEffect, useState } from "react";

const Profile = () => {
    const [locationCount, setLocationCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [thisUser, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const userId = 1;

    // Fetch counts and user
    useEffect(() => {
        fetch(`/api/locations/count?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => setLocationCount(Number(data)))
            .catch(console.error);

        fetch(`/api/books/count/user?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => setBookCount(Number(data)))
            .catch(console.error);

        fetch(`/api/friends/count?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => setFriendCount(Number(data)))
            .catch(console.error);

        fetch(`/api/users?userId=${userId}`)
            .then((res) => res.json())
            .then((userData) => setUser(userData))
            .catch(console.error);
    }, [userId]);

    // Fetch cover images once user is loaded
    useEffect(() => {
        if (!thisUser) return;

        const topIsbns = [
            thisUser.topOne,
            thisUser.topTwo,
            thisUser.topThree,
            thisUser.topFour,
        ].filter(Boolean);

        const coverPromises = topIsbns.map((isbn) =>
                                               fetch(`/api/books/googlecover?isbn=${isbn}`)
                                                   .then((res) => (res.ok ? res.text() : ""))
                                                   .catch(() => "")
                                                   .then((coverUrl) => ({ isbn, coverUrl }))
        );

        Promise.all(coverPromises)
            .then((booksWithCovers) => setBooks(booksWithCovers))
            .catch(console.error);
    }, [thisUser]);

    const pluralize = (count, singular, plural) =>
        `${count} ${count === 1 ? singular : plural}`;

    return (
        <div className="app-container">
            <div className="profile-header">
                <div className="page-title dm-mono-regular-italic">
                    <h1>PROFILE</h1>
                </div>
                <div className="username dm-mono-medium">
                    <p>{thisUser?.username}</p>
                </div>
            </div>
            <div className="split">
                <div className="profile-left dm-mono-regular">
                    <p>{pluralize(bookCount, "book", "books")}</p>
                    <p>{pluralize(locationCount, "location", "locations")}</p>
                    <p>{pluralize(friendCount, "friend", "friends")}</p>
                </div>
                <div className="profile-right dm-mono-regular profile-right">
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
