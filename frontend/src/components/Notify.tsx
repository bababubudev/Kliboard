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

        set_visible(true);

        if (message) {
            outerTimeout = setTimeout(() => {
                set_visible(false);
                innerTimeout = setTimeout(() => {
                    on_close();
                }, 500);
            }, 10_000);


            return () => {
                clearTimeout(innerTimeout);
                clearTimeout(outerTimeout);
            };
        }
    }, [message, on_close]);

    return (<>
        <button 
            className={`notif-div ${visible ? "fade-in" : "fade-out"}`}
            onClick={on_close}
        >
            <p>{message}</p>
        </button>
    </>);
}

export default Notify;