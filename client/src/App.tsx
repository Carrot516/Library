// client/src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import LibrariesMap from "./pages/LibrariesMap";
import MyAccount from "./pages/MyAccount";
import SearchingAccounts from "./pages/SearchingAccounts";
import SearchingBook from "./pages/SearchingBook";
import Sidebar from "./components/Sidebar";
import AddBook from "./pages/AddBook";
import AssignBook from "./pages/AssignBook";
import AddingBooks from "./pages/AddingBooks";
import AddAuthor from "./pages/AddAuthor";
import "./App.css";


function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/Login" element={<LoginPage/>}/>
                        <Route path="/LibrariesMap" element={<LibrariesMap/>}/>
                        <Route path="/SearchingAccounts" element={<SearchingAccounts/>}/>
                        <Route path="/MyAccount" element={<MyAccount/>}/>
                        <Route path="/SearchingBook" element={<SearchingBook/>}/>
                        <Route path="/AddBook" element={<AddBook/>}/>
                        <Route path="/AssignBook" element={<AssignBook/>}/>
                        <Route path="/AddAuthor" element={<AddAuthor/>}/>
                        <Route path="/AddingBooks" element={<AddingBooks/>}/>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;

//
// // client/src/App.tsx
//
// import React from 'react';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainPage from "./pages/MainPage";
// import LoginPage from "./pages/LoginPage";
// import LibrariesMap from "./pages/LibrariesMap";
// import MyAccount from "./pages/MyAccount";
// import SearchingAccounts from "./pages/SearchingAccounts";
// import SearchingBook from "./pages/SearchingBook";
// import Sidebar from "./components/Sidebar";
// import AddBook from "./pages/AddBook";
// import AssignBook from "./pages/AssignBook";
// import PrivateRoute from "./components/PrivateRoute";
//
// import "./App.css";
//
// function App() {
//     return (
//         <BrowserRouter>
//             <div className="app-container">
//                 <Sidebar />
//                 <div className="main-content">
//                     <Routes>
//                         {/* Public Routes */}
//                         <Route path="/" element={<MainPage />} />
//                         <Route path="/login" element={<LoginPage />} />
//                         <Route path="/libraries-map" element={<LibrariesMap />} />
//                         <Route path="/searching-accounts" element={<SearchingAccounts />} />
//                         <Route path="/searching-book" element={<SearchingBook />} />
//
//                         {/* Protected Routes */}
//                         <Route
//                             path="/my-account"
//                             element={
//                                 <PrivateRoute>
//                                     <MyAccount />
//                                 </PrivateRoute>
//                             }
//                         />
//                         <Route
//                             path="/add-book"
//                             element={
//                                 <PrivateRoute>
//                                     <AddBook />
//                                 </PrivateRoute>
//                             }
//                         />
//                         <Route
//                             path="/assign-book"
//                             element={
//                                 <PrivateRoute>
//                                     <AssignBook />
//                                 </PrivateRoute>
//                             }
//                         />
//
//                         {/* Fallback Route */}
//                         <Route path="*" element={<MainPage />} />
//                     </Routes>
//                 </div>
//             </div>
//         </BrowserRouter>
//     );
// }
//
// export default App;
//
