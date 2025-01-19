// // client/src/components/PrivateRoute.tsx
//
// import React from "react";
// import { Navigate } from "react-router-dom";
//
// // Opcjonalnie możesz zdefiniować interfejs dla propsów
// interface PrivateRouteProps {
//     children: JSX.Element;
// }
//
// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
//     // Sprawdź, czy użytkownik jest uwierzytelniony
//     const isAuthenticated = !!localStorage.getItem("authToken");
//
//     // Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }
//
//     // Jeśli użytkownik jest zalogowany, renderuj chroniony komponent
//     return children;
// };
//
// export default PrivateRoute;
