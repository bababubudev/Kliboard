import { ChangeEvent, FormEvent, useState } from "react";
import InboxArea from "./InboxArea";
import IInbox from "../interfaces/Inbox";

interface IDetails {
    space_name: string;
    on_update: (inbox: IInbox) => void;
}

function UnsavedInboxDetail({ space_name, on_update }: IDetails) {
    const [text, set_text] = useState<string>("");
    const [removal_time] = useState<Number>(0);

    const content = {
        space_name: space_name,
        space_text: text,
        removal: removal_time
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

    function handle_change(event: ChangeEvent<HTMLInputElement>): void {
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