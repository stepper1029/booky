import React from "react";
import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";
import axios from "axios";

function App() {
  const addBookToLibrary = async (bookInfo) => {
    try {
      await axios.post("http://localhost:8080/api/books", {
        title: bookInfo.title,
        authorFirstName: bookInfo.authors ? bookInfo.authors[0] : "",
        authorLastName: bookInfo.authors ? bookInfo.authors.slice(1).join(" ") : "",
        ISBN: bookInfo.industryIdentifiers?.[0]?.identifier || "",
        locationId: 1, // default location for now
        blurb: bookInfo.description || "",
      });
      alert("Book added!");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
      <div>
        <h1>Stepper Library</h1>
        <BookSearch onAddBook={addBookToLibrary} />
        <BookList />
      </div>
  );
}

export default App;
