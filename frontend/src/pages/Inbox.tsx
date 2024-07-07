import { useState } from "react";
import { useLocation } from "react-router-dom";

import SavedInboxDetail from "../components/SavedInboxDetail";
import UnsavedInboxDetail from "../components/UnsavedInboxDetail";
import Notify from "../components/Notify";
import type { TMessage } from "../components/Notify";
import LinkDetector from "../components/LinkDetector";

import { IInbox } from "../interfaces/Inbox";

function Inbox() {
    const [data, set_data] = useState<IInbox | null>(null);
    const [notification, set_notification] = useState<TMessage>(null);

    const location = useLocation();
    const name: string = location.state?.u_name;

    async function update_inbox(notif: TMessage, response: IInbox | null): Promise<void> {
        if (response) { set_data(response); }
        set_notification(notif);
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
                    <div className="extras">
                        <p className="update-p">
                            {data
                                ? getDate(data.updatedAt)
                                : getDate()
                            }
                        </p>

                        {data?.space_text && <LinkDetector text={data.space_text} />}
                    </div>
                </div>
            </div>
            {notification && <Notify notification={notification} on_close={close_notif} />}
        </>
    );
}

export default Inbox;