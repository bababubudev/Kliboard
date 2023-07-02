import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SavedInboxDetail from "../components/SavedInboxDetail";
import UnsavedInboxDetail from "../components/UnsavedInboxDetail";

import { IInbox } from "../interfaces/Inbox";

function Inbox() {
    const [data, set_data] = useState<IInbox | undefined>(undefined);

    const location = useLocation();
    const name: string = location.state?.u_name;

    async function fetch_data(): Promise<void> {
        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${name}`, { method: "GET" });

            if (response.status === 204) {
                console.log(`User of name ${name} not found!`);
                return;
            }

            const json = await response.json();
            set_data(json);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (name && !data) {
            fetch_data();
        }
    }, [data]);

    async function update_inbox(updated: IInbox): Promise<void> {
        console.log(updated._id)

        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${updated._id}`, { method: "GET" });
            const endData: IInbox = await response.json();

            set_data(endData);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="home">
            <div className="data">
                {data
                    ? <SavedInboxDetail inbox={data} on_update={update_inbox} />
                    : <UnsavedInboxDetail space_name={name} on_update={update_inbox} />
                }
            </div>
        </div>
    );
}

export default Inbox