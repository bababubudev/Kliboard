import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SavedInboxDetail from "../components/SavedInboxDetail";
import UnsavedInboxDetail from "../components/UnsavedInboxDetail";

import IInbox from "../interfaces/Inbox";

function Inbox() {
    const [data, setData] = useState<IInbox>();

    const location = useLocation();
    const name: string = location.state?.u_name;

    async function fetch_data() {
        const response = await fetch(`http://localhost:5000/api/inbox/${name}`, { method: "GET" });

        try {
            const json = await response.json();
            setData(json);
        }
        catch (err) {
            if (response.status === 204) {
                console.log("User not found!");
                return;
            }

            console.error(err);
        }
    }

    useEffect(() => {
        if (name && !data) {
            fetch_data();
        }
    }, [data]);


    return (
        <div className="home">
            <div className="data">
                {data
                    ? <SavedInboxDetail key={data._id} inbox={data} />
                    : <UnsavedInboxDetail space_name={name} />
                }
            </div>
        </div>
    );
}

export default Inbox