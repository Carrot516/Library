import React, { useState, useEffect } from 'react';

interface AssignData {
    book_id: number;
    library_id: number;
    status: string;
}

interface Book {
    bookid: number;
    book_name: string;
}

interface Library {
    libraryid: number;
    library_name: string;
}

const AssignBook: React.FC = () => {
    const [assignData, setAssignData] = useState<AssignData>({
        book_id: 0,
        library_id: 0,
        status: 'available',
    });
    const [books, setBooks] = useState<Book[]>([]);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksResponse = await fetch('/api/books');
                const booksData = await booksResponse.json();
                const transformedBooks: Book[] = booksData.map((item: any[]) => ({
                    bookid: item[0],
                    book_name: item[1],
                }));
                transformedBooks.sort((a, b) => a.book_name.localeCompare(b.book_name));
                setBooks(transformedBooks);

                const librariesResponse = await fetch('/api/libraries');
                const librariesData: Library[] = await librariesResponse.json();

                librariesData.sort((a, b) => a.libraryid - b.libraryid);
                setLibraries(librariesData);
            } catch (err: any) {
                setError('Failed to fetch books or libraries.');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setAssignData({
            ...assignData,
            [name]: name === 'book_id' || name === 'library_id' ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/assign', { // Endpoint do przypisywania książki
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to assign book.');
            }

            setSuccess(true);
            setAssignData({
                book_id: 0,
                library_id: 0,
                status: 'available',
            });
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }
    };

    return (
        <div className="assign-book-container">
            <h2>Przypisz Książkę do Biblioteki</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Książka została przypisana!</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Książka:</label>
                    <select name="book_id" value={assignData.book_id} onChange={handleChange} required>
                        <option value={0}>Wybierz książkę</option>
                        {books.map(book => (
                            <option key={book.bookid} value={book.bookid}>
                                {book.book_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Biblioteka:</label>
                    <select name="library_id" value={assignData.library_id} onChange={handleChange} required>
                        <option value={0}>Wybierz bibliotekę</option>
                        {libraries.map(lib => (
                            <option key={lib.library_id} value={lib.library_id}>
                                {lib.library_name}
                            </option>
                        ))}
                    </select>

                </div>
                <div>
                    <label>Status:</label>
                    <input
                        type="text"
                        name="status"
                        value={assignData.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Przypisz Książkę</button>
            </form>
        </div>
    );
};

export default AssignBook;
