import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox, emptyInbox } from "../interfaces/Inbox"
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox;
    on_update: (inbox: IInbox) => void;
}

function SavedInboxDetails({ inbox, on_update }: IDetails) {
    const [text, set_text] = useState<string>(inbox.space_text || "");
    const [removal_time] = useState<Number>(inbox.removal || 0);

    const updatedDate = new Date(inbox.updatedAt).toLocaleDateString();

    const content = {
        space_text: text,
        expires_in: removal_time
    }

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${inbox._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
            });

            const json = await response.json();

            console.log(json);
            on_update(json);
        }
        catch (err) {
            console.error(err);
        }
    }

    function handle_change(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        if (event.target instanceof HTMLSelectElement) {
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + Number(event.target.value));
            // set_removal_time(expiration);

            return;
        }

        set_text(event.target.value);
    }

    return (
        <InboxArea
            space_name={inbox.space_name}
            current_text={text}
            updated_date={updatedDate}

            handle_submit={handle_submit}
            handle_change={handle_change}
        />
    );
}

export default SavedInboxDetails