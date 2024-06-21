import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/upload">Upload</NavLink>
                <NavLink to="/youtube-upload">Youtube Upload</NavLink>

                <NavLink to="/about">About</NavLink>
            </nav>
        </div>
    );
}
