import { ChangeEvent, FormEvent } from "react";

interface IAreaDetails {
    space_name: string;
    current_text: string;
    updated_date: string;

    handle_submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    handle_change: (event: ChangeEvent<HTMLInputElement>) => void;
}


function InboxArea({ space_name, current_text, updated_date, handle_submit, handle_change }: IAreaDetails) {
    return (
        <div className="inbox-details">
            <h4>{space_name}</h4>
            <form onSubmit={handle_submit}>
                <input
                    type="text"
                    value={current_text}
                    id="input-text"
                    onChange={handle_change}
                    placeholder="Insert any text..."
                />


                <button type="submit">Save</button>
            </form>
            <p>{updated_date}</p>
        </div>
    );
}

export default InboxArea