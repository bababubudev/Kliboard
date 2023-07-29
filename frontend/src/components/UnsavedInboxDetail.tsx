import { ChangeEvent, FormEvent, useState } from "react";
import InboxArea from "./InboxArea";

interface IDetails {
    space_name: string;
    on_update: (notif: string | null, error: boolean) => Promise<void>;
}


function UnsavedInboxDetail({ space_name, on_update }: IDetails) {
    const [text, set_text] = useState<string>("");
    const [removal_time, set_removal_time] = useState<number>(1);

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (text === "") {
            on_update("Please provide some text first! The space cannot be left empty...", true);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/inbox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    space_name: space_name,
                    space_text: text,
                    removal: removal_time
                })
            });

            const json = await response.json();

            if (response.status === 400){
                throw new Error("Somthing went wrong. Please go back or try again!");
            }

            on_update(json["message"], false);
        } catch (err) {
            if (err instanceof Error)
                on_update(err.message, true);
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
        <>
            <InboxArea
                space_name={space_name}
                current_text={text}
                current_time={-1}
                disable_submit={false}

                handle_submit={handle_submit}
                handle_change={handle_change}
                handle_option={handle_option}
            />
        </>
    );
}

export default UnsavedInboxDetail;