import { ChangeEvent, FormEvent, useState } from "react";
import { IInbox } from "../interfaces/Inbox";
import InboxArea from "./InboxArea";
import type { TMessage } from "./Notify";
import SavedInboxMenu from "./SavedInboxMenu";

interface IDetails {
    inbox: IInbox;
    space_name: string | undefined;
    on_update: (notif: TMessage, data: IInbox | null) => Promise<void>;
}

function SavedInboxDetails({ inbox, on_update, space_name }: IDetails) {
    const [data, set_data] = useState<IInbox>(inbox);
    const [loading, set_loading] = useState<boolean>(false);
    const [limit, set_limit] = useState<boolean>(false);

    const disable_button = (): boolean => {
        return (inbox.space_text === data.space_text
            && inbox.removal === data.removal)
            || data.removal < -1 || limit;
    };

    async function handle_submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (disable_button()) return;
        if (space_name === undefined) return;

        if (data.space_text === "") {
            on_update({ message: "Uh-oh, you left the text-box empty. Try again!", status: "error" }, null);
            return;
        }

        try {
            set_loading(true);
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/inbox/${space_name}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ space_text: data.space_text, removal: data.removal })
            });

            const json = await response.json();

            if (!response.ok) {
                if (response.status === 429) set_limit(true);
                throw new Error(json["error"]);
            }

            on_update({ message: json["message"], status: "success" }, json);
            set_loading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                on_update({ message: err.message, status: "error" }, null);
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
                on_update({ message: "Space is up to date.", status: "info" }, data);
                set_loading(false);

                setTimeout(() => {
                    on_update({ message: json["message"], status: "info" }, null);
                }, 5_500);

                return;
            }

            set_data(json);
            on_update({ message: "Space upated!", status: "success" }, json);

            setTimeout(() => {
                on_update({ message: json["message"], status: "info" }, null);
            }, 5_500);

            set_loading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                on_update({ message: err.message, status: "error" }, null);
            }
            set_loading(false);
        }
    }

    async function copy_data() {
        try {
            set_loading(true);
            if (data.space_text) {
                await navigator.clipboard.writeText(data.space_text);
                on_update({ message: "Text copied to clipboard", status: "success" }, null);
            }
            else {
                on_update({ message: "Oh ohh, there is nothing to copy...", status: "info" }, null);
            }
            set_loading(false);
        } catch (err) {
            on_update({ message: "Oops, something went wrong :/", status: "error" }, null);
            set_loading(false);
        }
    }

    return (
        <>
            <SavedInboxMenu
                fetch_data={() => { fetch_data(data.space_name); }}
                loading={loading}
                copy_data={copy_data}
            />
            <InboxArea
                space_name={space_name || "Empty Space"}
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