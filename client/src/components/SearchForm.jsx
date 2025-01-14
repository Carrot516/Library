import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        book_name: '',
        author: '',
        genre: '',
        release_year: ''
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="book_name"
                value={filters.book_name}
                onChange={handleChange}
                placeholder="Wpisz nazwę książki"
            />
            <input
                type="text"
                name="author"
                value={filters.author}
                onChange={handleChange}
                placeholder="Wpisz autora"
            />
            <input
                type="text"
                name="genre"
                value={filters.genre}
                onChange={handleChange}
                placeholder="Wpisz gatunek"
            />
            <input
                type="number"
                name="release_year"
                value={filters.release_year}
                onChange={handleChange}
                placeholder="Wpisz rok wydania"
            />
            <button type="submit">Szukaj</button>
        </form>
    );
};

export default SearchForm;
