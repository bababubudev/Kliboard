import { useEffect, useState } from "react";
import { NotifBell } from "../Icons";
export type TMessage = { 
    message: string,
    status: "error" | "success" | "info" 
} | null;

interface NotifProp {
    notification: TMessage,
    on_close: () => void;
}
function Notify({ notification, on_close }: NotifProp) {
    const [visible, set_visible] = useState<boolean>(true);

    useEffect(() => {
        let innerTimeout: NodeJS.Timeout;
        let outerTimeout: NodeJS.Timeout;

        set_visible(true);

        if (notification) {
            outerTimeout = setTimeout(() => {
                set_visible(false);
                innerTimeout = setTimeout(() => {
                    on_close();
                }, 500);
            }, 5_000);


            return () => {
                clearTimeout(innerTimeout);
                clearTimeout(outerTimeout);
            };
        }
    }, [notification, on_close]);

    return (<>
        <button
            className={`notif-div ${visible ? "fade-in" : "fade-out"} ${notification?.status}`}
            onClick={on_close}
        >
            <p>{notification?.message}</p>
            <NotifBell />
        </button>
    </>);
}

export default Notify;