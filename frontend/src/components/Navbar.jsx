import { NavLink } from "react-router-dom";

import {
    FiHome,
    FiFileText,
    FiMap,
    FiUser,
    FiSettings
} from "react-icons/fi";

function Navbar() {

    return (

        <nav className="mobile-navbar">

            <NavLink to="/dashboard">

                <FiHome />

                <span>Home</span>

            </NavLink>


            <NavLink to="/resume">

                <FiFileText />

                <span>Resume</span>

            </NavLink>


            <NavLink to="/roadmap">

                <FiMap />

                <span>Roadmap</span>

            </NavLink>


            <NavLink to="/profile">

                <FiUser />

                <span>Profile</span>

            </NavLink>


            <NavLink to="/settings">

                <FiSettings />

                <span>Settings</span>

            </NavLink>

        </nav>

    );

}

export default Navbar;