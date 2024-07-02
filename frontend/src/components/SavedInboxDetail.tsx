import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox } from "../interfaces/Inbox";
import InboxArea from "./InboxArea";
import { ReloadIcon } from "../Icons";

interface IDetails {
    inbox: IInbox;
    space_name: string;
    on_update: (notif: string | null, data: IInbox | null) => Promise<void>;
}

function SavedInboxDetails({ inbox, on_update, space_name }: IDetails) {
    const [data, set_data] = useState<IInbox>(inbox);
    const [loading, set_loading] = useState<boolean>(false);

    const disable_button = (): boolean => {
        return (inbox.space_text === data.space_text
            && inbox.removal === data.removal)
            || data.removal < -1;
    };

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (disable_button()) return;

        if (data.space_text === "") {
            on_update("Please provide some text first", null);
            return;
        }

        try {
            set_loading(true);
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/inbox/${space_name}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ space_text: data.space_text, removal: data.removal })
            });

            const remainingRequests = response.headers.get("X-RateLimit-Warning");
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json["error"]);
            }

            if (remainingRequests) {
                on_update("warning: request limit almost reached", null);
                set_loading(false);

                return;
            }

            on_update(json["message"], json);
            set_loading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                on_update(err.message, null);
            }
            set_loading(false);
        }
    }

    function handle_change(event: ChangeEvent<HTMLTextAreaElement>): void {
        const value = event.target.value;
        set_data((prevData) => ({ ...prevData, space_text: value }));
    }

    function handle_option(change: string): void {
        try {
            const parsedNum = Number.parseInt(change);
            set_data((prevData) => ({ ...prevData, removal: parsedNum }));
        } catch (err) {
            console.error(err);
        }
    }

    async function fetch_data(name: string) {
        try {
            set_loading(true);
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/inbox/${name}`, { method: "GET" });
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json["error"]);
            }

            if (json.space_text == data.space_text && json.removal == data.removal) {
                on_update("space is up to date", data);
                set_loading(false);
                return;
            }

            set_data(json);
            on_update("space updated", json);

            set_loading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                on_update(err.message, null);
            }
            set_loading(false);
        }
    }

    return (
        <>
            {inbox.removal > -1
                ? <button
                    type="button"
                    className="reload-btn"
                    tabIndex={0}
                    onClick={() => { fetch_data(inbox.space_name); }}
                    disabled={loading}
                >
                    <ReloadIcon />
                </button>
                : null
            }
            <InboxArea
                space_name={space_name}
                current_text={data.space_text || ""}
                current_time={data.removal}
                disable_submit={disable_button()}
                is_loading={loading}

                handle_change={handle_change}
                handle_submit={handle_submit}
                handle_option={handle_option}
            />
        </>

    );
}

export default SavedInboxDetails;