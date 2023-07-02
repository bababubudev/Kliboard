import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const [text, setText] = useState<string>("");
    const navigate = useNavigate();

    function handle_submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigate(`/inbox`, { state: { u_name: text } });
    }

    function handle_change(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    return (
        <div className="home">
            <form onSubmit={handle_submit}>
                <label htmlFor="input-text">Create Space</label>
                <input
                    type="text"
                    value={text}
                    id="input-text"
                    onChange={handle_change}
                    placeholder="Create space or enter an existing one..."
                />

                <button type="submit" id="enter" className="entry">
                    Go
                </button>
            </form>
        </div>
    )
}

export default Home