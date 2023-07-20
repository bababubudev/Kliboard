import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SavedInboxDetail from "../components/SavedInboxDetail";
import UnsavedInboxDetail from "../components/UnsavedInboxDetail";

import { IInbox } from "../interfaces/Inbox";

function Inbox() {
    const [data, set_data] = useState<IInbox | undefined>(undefined);

    const location = useLocation();
    const name: string = location.state?.u_name;

    async function fetch_data(name: string): Promise<void> {
        try {
            const response = await fetch(`http://localhost:5000/api/inbox/${name}`, { method: "GET" });

            if (response.status === 204) {
                throw new Error(`User of name ${name} not found!`)
            }

            const json = await response.json();
            set_data(json);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (name && !data) {
            fetch_data(name);
        }
    }, []);

    async function update_inbox(): Promise<void> {
        fetch_data(name)
    }

    return (
        <>
            <div className="inbox">
                {data
                    ? <SavedInboxDetail space_name={name} inbox={data} on_update={update_inbox} />
                    : <UnsavedInboxDetail space_name={name} on_update={update_inbox} />
                }
            </div>
        </>
    );
}

export default Inbox