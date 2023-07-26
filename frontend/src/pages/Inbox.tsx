import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SavedInboxDetail from "../components/SavedInboxDetail";
import UnsavedInboxDetail from "../components/UnsavedInboxDetail";
import Notify from "../components/Notify";

import { IInbox } from "../interfaces/Inbox";

function Inbox() {
    const [data, set_data] = useState<IInbox | undefined>(undefined);
    const [notification, set_notification] = useState<string | null>(null);

    const location = useLocation();
    const name: string = location.state?.u_name;

    async function fetch_data(name: string, has_notif = false): Promise<void> {
        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${name}`, { method: "GET" });
            const json = await response.json();

            if (response.status === 206 && !has_notif) {
                set_notification(json["greet"]);
                return;
            }

            set_data(json);
            if (!has_notif) set_notification(json["time_left"]);
        }
        catch (err) {
            if (err instanceof Error)
                set_notification(err.message);
        }
    }

    useEffect(() => {
        if (name && !data) {
            fetch_data(name);
        }
    }, []);

    async function update_inbox(notif: string | null = null): Promise<void> {
        set_notification(notif);
        fetch_data(name, notif !== null);
    }

    function close_notif() {
        set_notification(null);
    }

    function getDate(date: Date | null = null) {
        const currentDate = date ? date : Date.now();
        return new Date(currentDate)
            .toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
    }

    return (
        <>
            <div className="inbox">
                {data
                    ? <SavedInboxDetail space_name={name} inbox={data} on_update={update_inbox} />
                    : <UnsavedInboxDetail space_name={name} on_update={update_inbox} />
                }

                <div className="detailing">
                    {notification && <Notify message={notification} on_close={close_notif} />}
                    <p className="update-p">
                        {data
                            ? getDate(data.updatedAt)
                            : getDate()
                        }
                    </p>
                </div>
            </div>
        </>
    );
}

export default Inbox;