import React, { useState } from "react";

interface AccountData {
    name: string;
    country: string;
    city: string;
    street: string;
    home_number: number;
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<AccountData>({
        name: "",
        country: "",
        city: "",
        street: "",
        home_number: 0,
        email: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "home_number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!formData.name || !formData.email || !formData.password) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Błąd rejestracji.");
            }

            setSuccess(true);
            setFormData({
                name: "",
                country: "",
                city: "",
                street: "",
                home_number: 0,
                email: "",
                password: "",
            });
        } catch (err: any) {
            setError(err.message || "Coś poszło nie tak.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h2>Rejestracja użytkownika</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Rejestracja zakończona sukcesem!</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Imię:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Kraj:</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Miasto:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Ulica:</label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Numer domu:</label>
                    <input
                        type="number"
                        name="home_number"
                        value={formData.home_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Zarejestruj się</button>
            </form>
        </div>
    );
};

export default LoginPage;
