import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LightIcon, DarkIcon } from "../Icons";

function Navbar() {
    const [light, set_light] = useState<boolean>(false);

    useEffect(() => {
        const currentBody = document.body;
        const currentTheme = light ? "light" : "dark";

        currentBody.setAttribute("data-theme", currentTheme);
    }, [light]);

    function toggle_light() {
        const storedTheme = localStorage.getItem("theme");

        set_light(prev => !prev);
        const currentTheme = light ? "dark" : "light";

        if (!storedTheme || storedTheme !== currentTheme) {
            localStorage.setItem("theme", currentTheme);
        }
    }

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");

        if (storedTheme) {
            set_light(storedTheme === "dark" ? false : true);
        }
    }, []);

    return (
        <>
            <header>
                <div className="nav-container">
                    <Link to="/">
                        <h1>Kliboard</h1>
                    </Link>

                    <button
                        type="button"
                        onClick={toggle_light}
                    >
                        {light ? <DarkIcon /> : <LightIcon />}
                    </button>
                </div>
            </header>
        </>
    );
}

export default Navbar;