// client/src/pages/SearchingBook.tsx

import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import './SearchingBook.css';

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
    // Stan przechowujący aktualne filtry wyszukiwania
    const [filters, setFilters] = useState<Filters>({
        book_name: '',
        author: '',
        genre: '',
        release_year: '',
    });

    // Stan przechowujący wyniki wyszukiwania
    const [books, setBooks] = useState<Book[]>([]);

    // Stan obsługujący ładowanie i błędy
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Stan obsługujący paginację
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 10; // Liczba wyników na stronę

    // Funkcja obsługująca wyszukiwanie
    const handleSearch = async (newFilters: Filters) => {
        setLoading(true);
        setError(null);
        setBooks([]);
        setPage(1);
        setFilters(newFilters);

        await fetchBooks(newFilters, 1);
    };

    // Funkcja pobierająca książki z API
    const fetchBooks = async (currentFilters: Filters, pageNumber: number) => {
        const queryParams = new URLSearchParams({
            book_name: currentFilters.book_name,
            author: currentFilters.author,
            genre: currentFilters.genre,
            release_year: currentFilters.release_year,
            page: pageNumber.toString(),
            limit: limit.toString(),
        });

        console.log("Sending request with filters:", queryParams.toString());

        try {
            const response = await fetch(`/api/books?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Received data from API:", data); // Dodany log

            // Sprawdzenie, czy data jest tablicą
            if (Array.isArray(data)) {
                // Przekształcenie tablic tablic do tablicy obiektów Book
                const transformedBooks: Book[] = data.map((item: any[]) => ({
                    bookid: item[0],
                    book_name: item[1],
                    book_release_year: item[2],
                    book_orig_lang: item[3],
                    author_name: item[4],
                    genres: item[5],
                }));
                setBooks(transformedBooks); // Aktualizacja stanu `books` z przekształconymi danymi
                setTotalPages(1); // Ponieważ backend nie zwraca `totalPages`, ustawiamy domyślną wartość
            } else {
                console.error("Nieprawidłowa struktura danych:", data);
                setBooks([]);
                setTotalPages(1);
            }

        } catch (err: any) {
            console.error("Error fetching books:", err);
            setError(err.message || "Something went wrong");
            setBooks([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Funkcja obsługująca zmianę strony w paginacji
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        fetchBooks(filters, newPage);
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
