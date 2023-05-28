import { useState } from "react";
<<<<<<< HEAD
import { useNavigate, Link } from "react-router-dom";

function Home() {
    const [inputValue, setInputValue] = useState<string>("");
    const navigate = useNavigate();

    function handleInput(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("space-name");

        console.log(name);
        navigate(`/inbox/${inputValue}`);
    }

    return (
        <>
            <form onSubmit={handleInput} className="form-obj">
                <input
                    type="text"
                    name="space-name"
                    value={inputValue}
=======
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
                <input
                    type="text"
                    value={text}
                    id="input-text"
                    onChange={handle_change}
                    placeholder="Create space or enter an existing one..."
>>>>>>> a48e2c18e0c53cc60448d961a29fad5691bbfb8b
                />

                <button type="submit">Create</button>
            </form>
<<<<<<< HEAD
        </>
=======
        </div>
>>>>>>> a48e2c18e0c53cc60448d961a29fad5691bbfb8b
    )
}

export default Home