import React, { useState } from "react";

// Typy dla danych
interface ResponseMessage {
    message?: string;
    error?: string;
}

const AddingBooks: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [bookName, setBookName] = useState<string>("");
    const [libraryName, setLibraryName] = useState<string>("");
    const [borrowDate, setBorrowDate] = useState<string>("");  // Zmienna do daty wypożyczenia
    const [returnEmail, setReturnEmail] = useState<string>(""); // Zmienna do emailu dla zwrotu
    const [returnDate, setReturnDate] = useState<string>(""); // Zmienna do daty zwrotu

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Funkcja obsługująca wypożyczenie książki
    const handleBorrow = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("/api/borrow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    book_name: bookName,
                    library_name: libraryName,
                    borrow_date: borrowDate, // Wysyłamy datę wypożyczenia
                }),
            });

            const result: ResponseMessage = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || "Książka została wypożyczona.");
            } else {
                setError(result.error || "Wystąpił błąd podczas wypożyczania książki.");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem.");
        }
    };

    // Funkcja obsługująca zwrot książki
    const handleReturn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("/api/return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: returnEmail, // Używamy emailu z formularza zwrotu
                    book_name: bookName,
                    library_name: libraryName,
                    return_date: returnDate, // Wysyłamy datę zwrotu
                }),
            });

            const result: ResponseMessage = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || "Książka została zwrócona.");
            } else {
                setError(result.error || "Wystąpił błąd podczas zwrotu książki.");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="container">
            <h2>Wypożyczenie książki</h2>
            <form onSubmit={handleBorrow}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bookName">Tytuł książki:</label>
                    <input
                        type="text"
                        id="bookName"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="libraryName">Nazwa biblioteki:</label>
                    <input
                        type="text"
                        id="libraryName"
                        value={libraryName}
                        onChange={(e) => setLibraryName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Data wypożyczenia:</label>
                    <input
                        type="date"
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Wypożycz książkę</button>
            </form>

            <h2>Zwrot książki</h2>
            <form onSubmit={handleReturn}>
                <div>
                    <label htmlFor="returnEmail">Email:</label>
                    <input
                        type="email"
                        id="returnEmail"
                        value={returnEmail}
                        onChange={(e) => setReturnEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="returnBookName">Tytuł książki:</label>
                    <input
                        type="text"
                        id="returnBookName"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="returnLibraryName">Nazwa biblioteki:</label>
                    <input
                        type="text"
                        id="returnLibraryName"
                        value={libraryName}
                        onChange={(e) => setLibraryName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="returnDate">Data zwrotu:</label>
                    <input
                        type="date"
                        id="returnDate"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Zwróć książkę</button>
            </form>

            {/* Wyświetlanie komunikatów o błędach lub sukcesach */}
            {error && <div style={{ color: "red" }}>{error}</div>}
            {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
        </div>
    );
};

export default AddingBooks;
