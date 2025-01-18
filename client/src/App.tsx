// client/src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import LibrariesMap from "./pages/LibrariesMap.tsx";
import MyAccount from "./pages/MyAccount.tsx";
import SearchingAccounts from "./pages/SearchingAccounts.tsx";
import SearchingBook from "./pages/SearchingBook.tsx";
import Sidebar from "./components/Sidebar.tsx";
import AddBook from "./pages/AddBook.tsx"
import AssignBook from "./pages/AssignBook.tsx"

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
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;


//
// import React from 'react';
// import MainPage from "./pages/MainPage.tsx";
// import "./App.css";
//
// function App() {
//     return (
//         <MainPage />
//     );
// }
//
// export default App;
