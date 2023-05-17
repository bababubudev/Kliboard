import { ChangeEvent, FormEvent, useState } from "react";
import IInbox from "../interfaces/Inbox"
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox
}

function SavedInboxDetails({ inbox }: IDetails) {
    const [text, setText] = useState<string>(inbox.space_text || "");
    const [removal, setRemoval] = useState<Number>(inbox.removal || 0);

    const updatedDate = new Date(inbox.updatedAt).toLocaleDateString();

    const content = {
        space_text: text,
        removal: removal
    }

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const response = await fetch(`http://localhost:5000/api/inbox/${inbox._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(content)
        });

        try {
            const json = await response.json();
            console.log(json);
        }
        catch (err) {
            if (response.status === 204) {
                console.log("User not found!");
                return;
            }

            console.error(err);
        }
    }

    function handle_change(event: ChangeEvent<HTMLInputElement>): void {
        setText(event.target.value);
    }

    return (
        <InboxArea inbox=inbox />
    );
}

export default SavedInboxDetails