import React, { useState } from "react";
import axios from "axios";

const BookSearch = ({ onAddBook }) => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);

    const searchBooks = async (type) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/external-books/search/${type}`,
                { params: { [type]: query } }
            );
            setBooks(response.data.items || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    return (
        <div>
            <h2>Search Books</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <button onClick={() => searchBooks("title")}>Search by Title</button>
            <button onClick={() => searchBooks("author")}>Search by Author</button>

            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <strong>{book.volumeInfo.title}</strong> by{" "}
                        {book.volumeInfo.authors?.join(", ")}
                        <button onClick={() => onAddBook(book.volumeInfo)}>Add to Library</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookSearch;
