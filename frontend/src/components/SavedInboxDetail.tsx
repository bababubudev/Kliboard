import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox } from "../interfaces/Inbox"
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox;
    space_name: string;
    on_update: () => void;
}

function SavedInboxDetails({ inbox, on_update, space_name }: IDetails) {
    const [text, set_text] = useState<string>(inbox.space_text || "");
    const [removal_time, set_removal_time] = useState<number>(inbox.removal || 0);

    const updatedDate = new Date(inbox.updatedAt).toLocaleDateString();

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${space_name}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ space_text: text, removal: removal_time })
            });

            const json = await response.json();
            // console.log(json);

            on_update();
        }
        catch (err) {
            console.error(err);
        }
    }

    function handle_change(event: ChangeEvent<HTMLTextAreaElement>): void {
        set_text(event.target.value);
    }

    function handle_option(change: string): void {
        try {
            const parsedNum = Number.parseInt(change);
            set_removal_time(parsedNum);
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <InboxArea
            space_name={space_name}
            current_text={text}
            current_time={removal_time}
            updated_date={updatedDate}

            handle_change={handle_change}
            handle_submit={handle_submit}
            handle_option={handle_option}
        />
    );
}

export default SavedInboxDetails