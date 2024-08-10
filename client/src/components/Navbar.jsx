import { NavLink } from "react-router-dom";
import './Navbar.css'

export default function Navbar() {
    return (
        <div class="nav-container">
            <nav>
                <NavLink to="/"><span style={{textDecoration: "underline"}}>Video2SheetMusic</span></NavLink>

                <div><NavLink to="/">Home</NavLink>

<NavLink to="/about">About</NavLink></div>
                
            </nav>
        </div>
    );
}
