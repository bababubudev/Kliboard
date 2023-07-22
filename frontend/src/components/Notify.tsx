import React from "react";

interface NotifProp {
    message: string,
    on_close: (React.MouseEventHandler<HTMLButtonElement>);
}

function Notify({ message, on_close }: NotifProp) {
    return (<>
        <div className="notif-div">
            <p className="notif-p">{message}</p>
            <button className="close-notif" onClick={on_close}><span>&#9587;</span></button>
        </div>
    </>);
}

export default Notify;