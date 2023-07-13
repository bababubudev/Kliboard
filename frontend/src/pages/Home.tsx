import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const [text, set_text] = useState<string>("");
    const has_spaces = text.includes(" ");

    const headRef = useRef<HTMLLabelElement>(null);
    const navigate = useNavigate();

    function handle_submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (has_spaces) {
            if (headRef.current) {
                headRef.current.textContent = "please remove spaces";
            }

            return;
        }

        navigate(`/inbox`, { state: { u_name: text } });
    }

    function handle_change(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        if (headRef.current) {
            if (value.includes(" ")) {
                headRef.current.textContent = "spaces are bad :/";
                headRef.current.classList.toggle("home-input-err", true);
            }
            else {
                headRef.current.textContent = "create a space";
                headRef.current.classList.toggle("home-input-err", false);
            }
        }

        set_text(value);
    }

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
                    autoComplete="off"
                    required
                />

                <button
                    type="submit"
                    id="enter"
                    className="entry"
                    disabled={has_spaces}
                >
                    GO
                </button>
            </form>
        </div>
    )
}

export default Home