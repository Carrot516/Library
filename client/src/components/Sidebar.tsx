// client/src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Stylizacja sidebaru

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Biblioteka</h2>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" end activeClassName="active">
                            Strona Główna
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Login" activeClassName="active">
                            Logowanie
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/LibrariesMap" activeClassName="active">
                            Mapa Bibliotek
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/SearchingAccounts" activeClassName="active">
                            Szukanie Kont
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/MyAccount" activeClassName="active">
                            Moje Konto
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/SearchingBook" activeClassName="active">
                            Szukanie Książek
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

