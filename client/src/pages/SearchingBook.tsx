import React, { useState } from 'react';
import './SearchingBook.css'; // Import pliku CSS

interface Book {
    bookid: number;
    book_name: string;
    book_release_year: number;
    book_orig_lang: string;
    author_name: string;
    genres: string[];
}

export default function SearchingBook() {
    const [filters, setFilters] = useState({
        book_name: '',
        author: '',
        genre: '',
        release_year: '',
    });

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 10; // Liczba wyników na stronę

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setBooks([]);
        setPage(1);

        fetchBooks(1);
    };

    const fetchBooks = async (pageNumber: number) => {
        // Budowanie query string
        const queryParams = new URLSearchParams({
            ...filters,
            page: pageNumber.toString(),
            limit: limit.toString(),
        });

        try {
            const response = await fetch(`/api/books?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data: Book[] = await response.json();
            setBooks(data);
            // Zakładamy, że backend zwraca tylko część danych i nie mamy informacji o całkowitej liczbie wyników.
            // Można to rozszerzyć, modyfikując backend, aby zwracał dodatkowe informacje.
            setTotalPages(5); // Przykładowa wartość, należy dynamicznie obliczać na podstawie danych
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchBooks(newPage);
    };

    return (
        <div>
            <h1>Szukanie Książek</h1>
            <p>Tutaj wyszukasz książki i je zarezerwujesz/wypożyczysz</p>
            <form onSubmit={handleSearch}>
                <div>
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
                {/* Inne pola */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Wyszukiwanie...' : 'Szukaj'}
                </button>
            </form>

            {error && <p style={{color: 'red'}}>{error}</p>}

            <div>
                <h2>Wyniki:</h2>
                {books.length === 0 && !loading && <p>Brak wyników.</p>}
                {books.map((book) => (
                    <div key={book.bookid} className="book-card">
                        <h3>{book.book_name}</h3>
                        <p><strong>Autor:</strong> {book.author_name}</p>
                        <p><strong>Rok Wydania:</strong> {book.book_release_year}</p>
                        <p><strong>Język Oryginalny:</strong> {book.book_orig_lang}</p>
                        <p><strong>Gatunki:</strong> {book.genres.join(', ')}</p>
                    </div>
                ))}

                {/* Paginacja */}
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1 || loading}
                    >
                        Poprzednia
                    </button>
                    <span>Strona {page} z {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages || loading}
                    >
                        Następna
                    </button>
                </div>
            </div>

        </div>
    );
};
