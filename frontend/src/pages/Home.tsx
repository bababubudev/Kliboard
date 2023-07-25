import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const [text, set_text] = useState<string>("");
    // const [saved_text, set_saved_text] = useState<string>((): string => {
    //     return localStorage.getItem("saved") || "";
    // });

    const has_spaces = text.includes(" ");
    const char_limit_reached = text.length > 16;

    const headRef = useRef<HTMLLabelElement>(null);
    const navigate = useNavigate();

    function handle_submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (has_spaces || char_limit_reached) {
            if (!headRef.current) return;

            headRef.current.textContent = "not allowed :/";
            return;
        }

        navigate("/inbox", { state: { u_name: text.toLowerCase() } });
    }

    function handle_change(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        if (!headRef.current) return;

        if (value.includes(" ")) {
            headRef.current.textContent = "spaces are bad :/";
            headRef.current.classList.toggle("home-input-err", true);
        }
        else if (value.length > 16) {
            headRef.current.textContent = "too much text :/";
            headRef.current.classList.toggle("home-input-err", true);
        }
        else {
            headRef.current.textContent = "create a space";
            headRef.current.classList.toggle("home-input-err", false);
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
                    autoFocus={true}
                    autoComplete="off"
                    required
                />
                <button
                    type="submit"
                    id="enter"
                    className="entry"
                    disabled={has_spaces || char_limit_reached}
                >
                    <span></span>
                </button>
            </form>
        </div>
    );
}

export default Home;