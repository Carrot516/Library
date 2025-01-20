
import React, { useState } from 'react';

interface AddBookData {
    book_name: string;
    book_release_year: number;
    book_orig_lang: string;
    author_name: string;
    genres: string[];
}

const AddBook: React.FC = () => {
    const [formData, setFormData] = useState<AddBookData>({
        book_name: '',
        book_release_year: 0,
        book_orig_lang: '',
        author_name: '',
        genres: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'book_release_year' ? parseInt(value) : value,
        });
    };

    const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            genres: value.split(',').map(g => g.trim()),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add book.');
            }

            setSuccess(true);
            setFormData({
                book_name: '',
                book_release_year: 0,
                book_orig_lang: '',
                author_name: '',
                genres: [],
            });
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }
    };

    return (
        <div className="add-book-container">
            <h2>Dodaj Nową Książkę</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Książka została dodana!</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Książka:</label>
                    <input
                        type="text"
                        name="book_name"
                        value={formData.book_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Rok Wydania:</label>
                    <input
                        type="number"
                        name="book_release_year"
                        value={formData.book_release_year}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Język Oryginalny:</label>
                    <input
                        type="text"
                        name="book_orig_lang"
                        value={formData.book_orig_lang}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Autor:</label>
                    <input
                        type="text"
                        name="author_name"
                        value={formData.author_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Gatunki (oddzielone przecinkami):</label>
                    <input
                        type="text"
                        name="genres"
                        value={formData.genres.join(', ')}
                        onChange={handleGenresChange}
                        required
                    />
                </div>
                <button type="submit">Dodaj Książkę</button>
            </form>
        </div>
    );
};

export default AddBook;
