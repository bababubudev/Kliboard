import { useEffect, useState } from "react";
import InboxDetails from "../components/InboxDetails";
import IInbox from "../interfaces/Inbox";

function Inbox() {
    const [data, setData] = useState<IInbox[]>([]);
    async function fetch_data() {
        const response = await fetch("http://localhost:5000/api/inbox", { method: "GET" });
        const json = await response.json();

        try {
            setData(json);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetch_data(); }, []);

    return (
        <div className="home">
            <div className="data">
                {data && data.map((inbox) => (
                    <InboxDetails key={inbox._id} inbox={inbox} />
                ))}
            </div>
        </div>
    );
}

export default Inbox