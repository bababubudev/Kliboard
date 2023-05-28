import { useState } from "react";
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
                />

                <button type="submit">Create</button>
            </form>
        </>
    )
}

export default Home