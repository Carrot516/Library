import React, { useState } from 'react';

interface Filters {
    book_name: string;
    author: string;
    genre: string;
    release_year: string;
}

interface SearchFormProps {
    onSearch: (filters: Filters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
    const [filters, setFilters] = useState<Filters>({
        book_name: '',
        author: '',
        genre: '',
        release_year: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { book_name, author, genre, release_year } = filters;
        if (!book_name && !author && !genre && !release_year) {
            alert('Proszę wprowadzić co najmniej jeden filtr wyszukiwania.');
            return;
        }
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
                <label htmlFor="book_name">Nazwa Książki:</label>
                <input
                    type="text"
                    id="book_name"
                    name="book_name"
                    value={filters.book_name}
                    onChange={handleChange}
                    placeholder="Wpisz nazwę książki"
                />
            </div>
            <div className="form-group">
                <label htmlFor="author">Autor:</label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    value={filters.author}
                    onChange={handleChange}
                    placeholder="Wpisz nazwisko autora"
                />
            </div>
            <div className="form-group">
                <label htmlFor="genre">Gatunek:</label>
                <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={filters.genre}
                    onChange={handleChange}
                    placeholder="Wpisz gatunek"
                />
            </div>
            <div className="form-group">
                <label htmlFor="release_year">Rok Wydania:</label>
                <input
                    type="number"
                    id="release_year"
                    name="release_year"
                    value={filters.release_year}
                    onChange={handleChange}
                    placeholder="Wpisz rok wydania"
                />
            </div>
            <button type="submit" className="search-button">
                Szukaj
            </button>
        </form>
    );
};

export default SearchForm;
