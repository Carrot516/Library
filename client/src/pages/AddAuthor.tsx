import React, { useState } from "react";

interface AuthorData {
    author_name: string;
    author_birth: number | null;
    author_death: string;
    author_primary_lang: string;
    author_nationality: string;
    author_field_of_activity: string;
    author_occupation: string;
    author_gender: string;
}

const AddAuthor: React.FC = () => {
    const [formData, setFormData] = useState<AuthorData>({
        author_name: "",
        author_birth: null,
        author_death: "",
        author_primary_lang: "",
        author_nationality: "",
        author_field_of_activity: "",
        author_occupation: "",
        author_gender: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "author_birth" ? Number(value) || null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!formData.author_name) {
            setError("author_name jest wymagane.");
            return;
        }

        try {
            const response = await fetch("/api/authors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to add author.");
            }
            setSuccess(true);
            setFormData({
                author_name: "",
                author_birth: null,
                author_death: "",
                author_primary_lang: "",
                author_nationality: "",
                author_field_of_activity: "",
                author_occupation: "",
                author_gender: "",
            });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h2>Dodaj Autora</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Dodano autora!</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Author Name (wymagany):</label>
                    <input
                        type="text"
                        name="author_name"
                        value={formData.author_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Rok urodzenia:</label>
                    <input
                        type="number"
                        name="author_birth"
                        value={formData.author_birth || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Data śmierci (tekst):</label>
                    <input
                        type="text"
                        name="author_death"
                        value={formData.author_death}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Język główny:</label>
                    <input
                        type="text"
                        name="author_primary_lang"
                        value={formData.author_primary_lang}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Narodowość:</label>
                    <input
                        type="text"
                        name="author_nationality"
                        value={formData.author_nationality}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Dziedzina aktywności:</label>
                    <input
                        type="text"
                        name="author_field_of_activity"
                        value={formData.author_field_of_activity}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Zawód:</label>
                    <input
                        type="text"
                        name="author_occupation"
                        value={formData.author_occupation}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Płeć:</label>
                    <input
                        type="text"
                        name="author_gender"
                        value={formData.author_gender}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Dodaj Autora</button>
            </form>
        </div>
    );
};

export default AddAuthor;
