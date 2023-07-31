import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import InboxArea from "./InboxArea";
import { IInbox } from "../interfaces/Inbox";

interface IDetails {
    space_name: string;
    on_update: (notif: string | null, data: IInbox | null) => Promise<void>;
}


function UnsavedInboxDetail({ space_name, on_update }: IDetails) {
    const [text, set_text] = useState<string>("");
    const [removal_time, set_removal_time] = useState<number>(1);
    const [loading, set_loading] = useState<boolean>(false);

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (text === "") {
            on_update("Please provide some text first! The space cannot be left empty...", null);
            return;
        }

        try {
            set_loading(true);
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
            
            set_loading(false);
            on_update(json["message"], json);
        } catch (err) {
            if (err instanceof Error)
                on_update(err.message, null);
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

    async function fetch_data(name: string){
        try {
            set_loading(true);

            const response = await fetch(`http://localhost:5000/api/inbox/${name}`, {method: "GET"});
            const json = await response.json();

            if (response.status === 206){
                on_update(json["greet"], null);
                set_loading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(json["error"]);
            }

            set_loading(false);
            on_update(json["time_left"], json);
        }
        catch(err) {
            if (err instanceof Error){
                on_update(err.message, null);
                set_loading(false);
            }
        }
    }

    useEffect(() => {
        if (space_name) {
            fetch_data(space_name);
        }
    }, [])

    return (
        <>
            <InboxArea
                space_name={space_name}
                current_text={text}
                current_time={-1}
                disable_submit={false}
                is_loading={loading}

                handle_submit={handle_submit}
                handle_change={handle_change}
                handle_option={handle_option}
            />
        </>
    );
}

export default UnsavedInboxDetail;