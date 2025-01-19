// client/src/pages/LoginPage.tsx
import React from 'react';

export default function LoginPage() {
    return (
        <div>
            <h1>Logowanie</h1>
            <p>Logowanie będzie tutaj.</p>
        </div>
    );
};
//
// // src/pages/LoginPage.tsx
//
// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// // import "./LoginPage.css"; // Jeśli używasz CSS dla stylizacji
//
// // Definicja typu dla danych logowania
// interface LoginData {
//     email: string;
//     password: string;
// }
//
// const LoginPage: React.FC = () => {
//     const navigate = useNavigate();
//
//     // Inicjalne wartości formularza
//     const initialValues: LoginData = {
//         email: "",
//         password: "",
//     };
//
//     // Schemat walidacji z użyciem Yup
//     const validationSchema = Yup.object({
//         email: Yup.string()
//             .email("Nieprawidłowy format email")
//             .required("Email jest wymagany"),
//         password: Yup.string()
//             .min(6, "Hasło musi mieć przynajmniej 6 znaków")
//             .required("Hasło jest wymagane"),
//     });
//
//     // Obsługa przesyłania formularza
//     const onSubmit = async (
//         values: LoginData,
//         { setSubmitting, setErrors }: any
//     ) => {
//         try {
//             const response = await axios.post("/api/login", values);
//
//             // Zakładając, że otrzymujesz token JWT
//             const { token } = response.data;
//
//             // Zapisz token w localStorage lub w innym bezpiecznym miejscu
//             localStorage.setItem("authToken", token);
//
//             // Przekieruj użytkownika na stronę główną lub dashboard
//             navigate("/dashboard");
//         } catch (error: any) {
//             if (
//                 error.response &&
//                 error.response.data &&
//                 error.response.data.error
//             ) {
//                 setErrors({ submit: error.response.data.error });
//             } else {
//                 setErrors({
//                     submit: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
//                 });
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };
//
//     return (
//         <div className="login-container">
//             <h2>Logowanie</h2>
//             <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={onSubmit}
//             >
//                 {({ isSubmitting, errors }) => (
//                     <Form>
//                         {/* Email */}
//                         <div className="form-group">
//                             <label htmlFor="email">Email:</label>
//                             <Field
//                                 type="email"
//                                 name="email"
//                                 id="email"
//                                 className="form-control"
//                             />
//                             <ErrorMessage name="email" component="div" className="error" />
//                         </div>
//
//                         {/* Hasło */}
//                         <div className="form-group">
//                             <label htmlFor="password">Hasło:</label>
//                             <Field
//                                 type="password"
//                                 name="password"
//                                 id="password"
//                                 className="form-control"
//                             />
//                             <ErrorMessage
//                                 name="password"
//                                 component="div"
//                                 className="error"
//                             />
//                         </div>
//
//                         {/* Błąd przesyłania */}
//                         {errors.submit && <div className="error">{errors.submit}</div>}
//
//                         {/* Przycisk logowania */}
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="btn btn-primary"
//                         >
//                             {isSubmitting ? "Logowanie..." : "Zaloguj się"}
//                         </button>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// };
//
// export default LoginPage;
