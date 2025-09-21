import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // change this to match your backend

export const searchBooksByTitle = async (title) => {
    try {
        const res = await axios.get(`${BASE_URL}/books/search/title`, {
            params: { title },
        });
        return res.data;
    } catch (err) {
        console.error('Error searching books by title:', err);
        return [];
    }
};
