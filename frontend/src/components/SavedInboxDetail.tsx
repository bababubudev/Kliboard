import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox } from "../interfaces/Inbox";
import InboxArea from "./InboxArea";

interface IDetails {
    inbox: IInbox;
    space_name: string;
    on_update: (notif: string | null, data: IInbox | null) => Promise<void>;
}

function SavedInboxDetails({ inbox, on_update, space_name }: IDetails) {
    const [text, set_text] = useState<string>(inbox.space_text || "");
    const [removal_time, set_removal_time] = useState<number>(inbox.removal || 0);
    const [loading, set_loading] = useState<boolean>(false);

    const disable_button = (): boolean => {
        return (inbox.space_text === text
            && inbox.removal === removal_time)
            || removal_time < -1;
    };

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (disable_button()) return;

        if (text === "") {
            on_update("Please provide some text first! The space cannot be left empty...", null);
            return;
        }

        try {
            set_loading(true);
            const response = await fetch(`http://localhost:5000/api/inbox/${space_name}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ space_text: text, removal: removal_time })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json["error"]);
            }

            on_update(json["message"], json);
            set_loading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                on_update(err.message, null);
                set_loading(true);
            }
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
            disable_submit={disable_button()}
            is_loading={loading}

            handle_change={handle_change}
            handle_submit={handle_submit}
            handle_option={handle_option}
        />
    );
}

export default SavedInboxDetails;