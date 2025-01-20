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
                            Rejestracja użytkowników
                        </NavLink>
                    </li>
                    {/*<li>*/}
                    {/*    <NavLink to="/LibrariesMap" activeClassName="active">*/}
                    {/*        Mapa Bibliotek*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <NavLink to="/SearchingAccounts" activeClassName="active">*/}
                    {/*        Szukanie Kont*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                    <li>
                        <NavLink to="/MyAccount" activeClassName="active">
                            Informacje o koncie czytelników
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/SearchingBook" activeClassName="active">
                            Szukanie Książek
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/AddBook" activeClassName="active">
                            Dodanie Książki do bazy
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/AssignBook" activeClassName="active">
                            Dodanie książki do biblioteki
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/AddAuthor" activeClassName="active">
                            Dodawanie informacji o autorze
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/AddingBooks" activeClassName="active">
                            Wypożyczanie i zwracanie książek
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

