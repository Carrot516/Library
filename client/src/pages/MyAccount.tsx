import React, { useState } from "react";

// Typy dla danych
interface BorrowedBook {
    book_name: string;
    borrowed_date: string;
    library_name: string;
    library_id: number;
}

interface ReadBook {
    book_name: string;
    borrowed_date: string;
    returned_date: string;
    library_name: string;
    library_id: number;
}

interface MyAccountResponse {
    borrowed: BorrowedBook[];
    read: ReadBook[];
}

const MyAccount: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [readBooks, setReadBooks] = useState<ReadBook[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setBorrowedBooks([]);
        setReadBooks([]);

        if (!email) {
            setError("Proszę podać email.");
            return;
        }

        try {
            const response = await fetch(`/api/myaccount?email=${encodeURIComponent(email)}`, {
                method: "GET",
            });
            const data: MyAccountResponse | { error: string } = await response.json();

            if (!response.ok) {
                // Jeśli serwer zwraca błąd
                const errorObj = data as { error: string };
                setError(errorObj.error || "Wystąpił błąd podczas pobierania danych.");
                return;
            }

            // Pomyślne pobranie książek
            const accountData = data as MyAccountResponse;
            setBorrowedBooks(accountData.borrowed);
            setReadBooks(accountData.read);
        } catch (err) {
            console.error(err);
            setError("Błąd połączenia z serwerem.");
        }
    };

    const formatDate = (dateString: string) => {
        const dateObject = new Date(dateString);
        return dateObject.toLocaleDateString("pl-PL");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Moje konto</h2>
            <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="email">Email użytkownika:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginLeft: "10px", padding: "5px", width: "70%" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px" }}>Pokaż moje książki</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Sekcja z aktualnie wypożyczonymi książkami */}
            {borrowedBooks.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>Aktualnie wypożyczone książki:</h3>
                    <ul>
                        {borrowedBooks.map((book, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                                <strong>{book.book_name}</strong> – Biblioteka: {book.library_name} (ID: {book.library_id}) –
                                Data wypożyczenia: {formatDate(book.borrowed_date)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sekcja z przeczytanymi (zwróconymi) książkami */}
            {readBooks.length > 0 && (
                <div>
                    <h3>Książki, które już zwróciłeś:</h3>
                    <ul>
                        {readBooks.map((book, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                                <strong>{book.book_name}</strong> – Biblioteka: {book.library_name} (ID: {book.library_id}) –
                                Data wypożyczenia: {formatDate(book.borrowed_date)}, Data zwrotu: {formatDate(book.returned_date)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MyAccount;
