import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LastEntries from "../components/LastEntries";

function Home() {
    const [text, set_text] = useState<string>("");
    const [entries, set_entries] = useState<string[]>([]);

    const has_spaces = text.includes(" ");
    const invalid_size = text.length == 0 || text.length > 16;

    const headRef = useRef<HTMLLabelElement>(null);
    const navigate = useNavigate();

    function handle_submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (has_spaces || invalid_size || text.length < 3) {
            if (!headRef.current) return;

            if (text.length < 3) {
                headRef.current.textContent = "at least 3 please :/";
                headRef.current.classList.toggle("home-input-err", true);
            }
            else {
                headRef.current.textContent = "not allowed :/";
            }

            return;
        }

        navigate("/inbox", { state: { u_name: text.toLowerCase() } });
    }

    function handle_change(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        let warningText: string;

        if (!headRef.current) return;

        if (value.includes(" ")) {
            warningText = "spaces are bad :/";
            headRef.current.classList.toggle("home-input-err", true);
        }
        else if (value.length > 16) {
            warningText = "too much text :/";
            headRef.current.classList.toggle("home-input-err", true);
        }
        else if (/\d/.test(value)) {
            warningText = "numbers are bad :/";
            headRef.current.classList.toggle("home-input-err", true);
        }
        else {
            warningText = "create a space";
            headRef.current.classList.toggle("home-input-err", false);
        }

        headRef.current.textContent = warningText;

        set_text(value);
    }

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/`, { method: "GET" });
                const json = await response.json();

                if (!isMounted) return;
                set_entries(json);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="home">
            <form onSubmit={handle_submit}>
                <label ref={headRef} htmlFor="input-text">create a space</label>
                <input
                    type="text"
                    value={text}
                    id="input-text"
                    onChange={handle_change}
                    placeholder="or enter an existing one..."
                    autoFocus={true}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    id="enter"
                    className="entry"
                    disabled={
                        has_spaces ||
                        invalid_size ||
                        /\d/.test(text)
                    }
                >
                    <span> &raquo; </span>
                </button>
            </form>
            {entries && <LastEntries names={entries} />}
        </div>
    );
}

export default Home;