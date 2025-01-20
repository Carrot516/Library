import React, { useState } from "react";

interface ResponseMessage {
    message?: string;
    error?: string;
}

const AddingBooks: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [bookName, setBookName] = useState<string>("");
    const [libraryName, setLibraryName] = useState<string>("");
    const [borrowDate, setBorrowDate] = useState<string>("");
    const [returnEmail, setReturnEmail] = useState<string>("");
    const [returnBookName, setReturnBookName] = useState<string>("");
    const [returnLibraryName, setReturnLibraryName] = useState<string>("");
    const [returnDate, setReturnDate] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleBorrow = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!email || !bookName || !libraryName || !borrowDate) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        try {
            const response = await fetch("/api/borrow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    book_name: bookName,
                    library_name: libraryName,
                    borrow_date: borrowDate,
                }),
            });

            const result: ResponseMessage = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || "Książka została wypożyczona.");
                // Resetowanie pól formularza
                setEmail("");
                setBookName("");
                setLibraryName("");
                setBorrowDate("");
            } else {
                setError(result.error || "Wystąpił błąd podczas wypożyczania książki.");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem.");
        }
    };

    const handleReturn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!returnEmail || !returnBookName || !returnLibraryName || !returnDate) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        try {
            const response = await fetch("/api/return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: returnEmail,
                    book_name: returnBookName,
                    library_name: returnLibraryName,
                    return_date: returnDate,
                }),
            });

            const result: ResponseMessage = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || "Książka została zwrócona.");
                // Resetowanie pól formularza
                setReturnEmail("");
                setReturnBookName("");
                setReturnLibraryName("");
                setReturnDate("");
            } else {
                setError(result.error || "Wystąpił błąd podczas zwrotu książki.");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="assign-book-container">
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
                    <label htmlFor="borrowDate">Data wypożyczenia:</label>
                    <input
                        type="date"
                        id="borrowDate"
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
                        value={returnBookName}
                        onChange={(e) => setReturnBookName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="returnLibraryName">Nazwa biblioteki:</label>
                    <input
                        type="text"
                        id="returnLibraryName"
                        value={returnLibraryName}
                        onChange={(e) => setReturnLibraryName(e.target.value)}
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

            {error && <div style={{ color: "red" }}>{error}</div>}
            {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
        </div>
    );
};

export default AddingBooks;
