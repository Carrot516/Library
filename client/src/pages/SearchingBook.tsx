import React, { useState } from 'react';
import SearchForm from '../components/SearchForm'; // Poprawiona ścieżka importu
import './SearchingBook.css'; // Import pliku CSS

interface Book {
    bookid: number;
    book_name: string;
    book_release_year: number;
    book_orig_lang: string;
    author_name: string;
    genres: string[];
}

interface Filters {
    book_name: string;
    author: string;
    genre: string;
    release_year: string;
}

const SearchingBook: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 10; // Liczba wyników na stronę

    // Funkcja obsługująca wyszukiwanie
    const handleSearch = async (newFilters: Filters) => {
        setLoading(true);
        setError(null);
        setBooks([]);
        setPage(1);

        fetchBooks(newFilters, 1);
    };

    // Funkcja pobierająca książki z API
    const fetchBooks = async (currentFilters: Filters, pageNumber: number) => {
        // Budowanie query string
        const queryParams = new URLSearchParams({
            ...currentFilters,
            page: pageNumber.toString(),
            limit: limit.toString(),
        });

        console.log("Sending request with filters:", queryParams.toString());

        try {
            const response = await fetch(`/api/books?${queryParams.toString()}`); // Użyj względnego URL, jeśli masz proxy
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Received data from API:", data); // Dodany log
            setBooks(data.books);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            console.error("Error fetching books:", err);
            setError(err.message || "Something went wrong");
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Funkcja obsługująca zmianę strony w paginacji
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchBooks({ book_name: "", author: "", genre: "", release_year: "" }, newPage); // Upewnij się, że przekazujesz aktualne filtry
    };

    return (
        <div className="searching-book-container">
            <h1>Szukanie Książek</h1>
            <p>Tutaj wyszukasz książki i je zarezerwujesz/wypożyczysz.</p>

            {/* Integracja komponentu SearchForm */}
            <SearchForm onSearch={handleSearch} />

            {/* Wyświetlanie komunikatów */}
            {loading && <p>Ładowanie...</p>}
            {error && <p className="error">{error}</p>}

            {/* Wyświetlanie wyników wyszukiwania */}
            <div className="results">
                {books.length > 0 ? (
                    <ul>
                        {books.map((book) => (
                            <li key={book.bookid} className="book-item">
                                <h3>{book.book_name}</h3>
                                <p><strong>Autor:</strong> {book.author_name}</p>
                                <p><strong>Rok Wydania:</strong> {book.book_release_year}</p>
                                <p><strong>Język Oryginalny:</strong> {book.book_orig_lang}</p>
                                <p><strong>Gatunki:</strong> {book.genres.join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>Brak wyników.</p>
                )}
            </div>

            {/* Paginacja */}
            {books.length > 0 && (
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
            )}
        </div>
    );
};

export default SearchingBook;
