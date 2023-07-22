import { useEffect, useState } from "react";

interface NotifProp {
    message: string,
    on_close: () => void;
}

function Notify({ message, on_close }: NotifProp) {
    const [visible, set_visible] = useState<boolean>(true);

    useEffect(() => {
        let innerTimeout: NodeJS.Timeout;
        let outerTimeout: NodeJS.Timeout;

        if (message) {
            outerTimeout = setTimeout(() => {
                set_visible(false);
                innerTimeout = setTimeout(() => {
                    on_close();
                }, 1000);
            }, 5000);

            return () => {
                clearTimeout(innerTimeout);
                clearTimeout(outerTimeout);
            }
        }
    }, [message]);

    return (<>
        <div className={`notif-div ${visible ? "fade-in" : "fade-out"}`}>
            <p>{message}</p>
            <button onClick={on_close}><span>&#9587;</span></button>
        </div>
    </>);
}

export default Notify;