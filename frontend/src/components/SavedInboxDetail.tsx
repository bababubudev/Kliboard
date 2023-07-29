import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox } from "../interfaces/Inbox";
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox;
    space_name: string;
    on_update: (notif: string | null) => Promise<void>;
}

function SavedInboxDetails({ inbox, on_update, space_name }: IDetails) {
    const [text, set_text] = useState<string>(inbox.space_text || "");
    const [removal_time, set_removal_time] = useState<number>(inbox.removal || 0);

    const getButtonState = (): boolean => {
        return inbox.space_text === text && inbox.removal === removal_time;
    };

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (getButtonState() || space_name === "prabesh") return;

        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${space_name}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ space_text: text, removal: removal_time })
            });

            const json = await response.json();

            if (response.status === 400) {
                on_update(json["error"]);
                return;
            }
            
            on_update(json["message"]);
        }
        catch (err) {
            if (err instanceof Error)
                on_update(err.message);
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
            console.error(err);
        }
    }

    return (
        <InboxArea
            space_name={space_name}
            current_text={text}
            current_time={removal_time}
            disable_submit={getButtonState()}

            handle_change={handle_change}
            handle_submit={handle_submit}
            handle_option={handle_option}
        />
    );
}

export default SavedInboxDetails;