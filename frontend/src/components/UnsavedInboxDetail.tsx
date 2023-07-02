import { ChangeEvent, FormEvent, useState } from "react";
import InboxArea from "./InboxArea";
import IInbox from "../interfaces/Inbox";

interface IDetails {
    space_name: string;
    on_update: (inbox: IInbox) => void;
}

function UnsavedInboxDetail({ space_name, on_update }: IDetails) {
    const [text, set_text] = useState<string>("");
    const [removal_time, set_removal_time] = useState<Date>(new Date());

    const content = {
        space_name: space_name,
        space_text: text,
        expires_in: removal_time
    }

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/inbox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content)
            });

            const json = await response.json();
            on_update(json);
        } catch (err) {
            console.error(err);
        }
    }

    function handle_change(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        if (event.target instanceof HTMLSelectElement) {
            const expiration = new Date();

            expiration.setHours(expiration.getHours() + Number(event.target.value));
            set_removal_time(expiration);

            return;
        }

        set_text(event.target.value);
    }

    return (
        <>
            <InboxArea
                space_name={space_name}
                current_text={text}
                updated_date={new Date().toLocaleDateString()}

                handle_submit={handle_submit}
                handle_change={handle_change}
            />
        </>
    );
}

export default UnsavedInboxDetail