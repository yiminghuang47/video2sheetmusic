import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <div>
                <Navbar />

                <Outlet />
                <footer className="footer">
                    <a
                        href="https://github.com/yiminghuang47/video2sheetmusic"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Source Code
                    </a>
                    <a href="mailto:yiminghuang47@gmail.com">Contact</a>
                </footer>
            </div>
        </>
    );
}

export default App;
