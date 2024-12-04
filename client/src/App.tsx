import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
import MainPage from "./pages/MainPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import LibrariesMap from "./pages/LibrariesMap";
import MyAccount from "./pages/MyAccount";
import SearchingAccounts from "./pages/SearchingAccounts";
import SearchingBook from "./pages/SearchingBook";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/LibrariesMap" element={<LibrariesMap />} />
                <Route path="/SearchingAccounts" element={<SearchingAccounts />} />
                <Route path="/MyAccount" element={<MyAccount />} />
                <Route path="/SearchingBook" element={<SearchingBook />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
