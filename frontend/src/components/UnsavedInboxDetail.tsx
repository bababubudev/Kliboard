import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import InboxArea from "./InboxArea";
import { IInbox } from "../interfaces/Inbox";
import type { TMessage } from "./Notify";

interface IDetails {
    space_name: string | undefined;
    on_update: (notif: TMessage, data: IInbox | null) => Promise<void>;
}

function UnsavedInboxDetail({ space_name, on_update }: IDetails) {
    const [text, set_text] = useState<string>("");
    const [removal_time, set_removal_time] = useState<number>(space_name === undefined ? -2 : -1);
    const [loading, set_loading] = useState<boolean>(false);

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (text === "") {
            on_update({ message: "Oops, textbox was empty...", status: "error" }, null);
            return;
        }

        if (removal_time < 0) {
            set_removal_time(0);
        }

        try {
            set_loading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/inbox`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    space_name: space_name,
                    space_text: text,
                    removal: removal_time === -1 ? 0 : removal_time
                })
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error("Something went wrong :/");
            }

            on_update({ message: json["message"], status: "success" }, json);
            set_loading(false);
        } catch (err) {
            set_loading(false);
            if (err instanceof Error)
                on_update({ message: err.message, status: "error" }, null);
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

    async function fetch_data(name: string): Promise<void> {
        try {
            set_loading(true);

            const timeout = setTimeout(() => {
                on_update({ message: "Fetching may take a while...(est. 1 minute)", status: "info" }, null);
            }, 5000);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/inbox/${name}`, { method: "GET" });
            const json = await response.json();

            if (response.status === 206) {
                on_update({ message: json["greet"], status: "info" }, null);
                set_loading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(json["error"]);
            }

            clearTimeout(timeout);
            set_loading(false);
            on_update({ message: json["message"], status: "info" }, json);
        }
        catch (err) {
            set_loading(false);
            if (err instanceof Error) {
                on_update({ message: err.message, status: "error" }, null);
            }
        }
    }

    useEffect(() => {
        if (space_name) {
            fetch_data(space_name);
        }
    }, []);

    return (
        <>
            <InboxArea
                space_name={space_name || "Empty space"}
                current_text={text}
                current_time={removal_time}
                disable_submit={space_name === undefined || removal_time < -1}
                is_loading={loading}

                handle_submit={handle_submit}
                handle_change={handle_change}
                handle_option={handle_option}
            />
        </>
    );
}

export default UnsavedInboxDetail;