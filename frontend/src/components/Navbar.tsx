import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    return (
        <>
            <header>
                <div className="nav-container">
                    <Link to="/">
                        <h1>{location.pathname === "/" ? "Kliboard" : "Go Back"}</h1>
                    </Link>
                </div>
            </header>
        </>
    );
}

export default Navbar;