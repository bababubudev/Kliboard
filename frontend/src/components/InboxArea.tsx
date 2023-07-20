import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface IAreaDetails {
    space_name: string;
    current_text: string;
    current_time: number;
    updated_date: string;

    handle_submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    handle_change: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    handle_option: (change: string) => void;
}


function InboxArea({ space_name, current_text, current_time, updated_date, handle_submit, handle_change, handle_option }: IAreaDetails) {
    const list_ref = useRef<HTMLUListElement>(null);
    const [option, set_option] = useState<string>(get_option(current_time));

    function initiate_options() {
        const current = list_ref.current;

        if (!current) return;
        current.classList.toggle("hide_list");
    }

    function call_options(elem: React.MouseEvent<HTMLLIElement>) {
        const currentText = elem.currentTarget.textContent;
        const currentTime = elem.currentTarget.getAttribute("value");

        if (!currentText || !currentTime) return;

        set_option(currentText);
        handle_option(currentTime);
    }

    function get_option(time: number) {
        switch (time) {
            case 0:
                return "Don't remove";
            case 1:
                return "1 Hour";
            case 10:
                return "10 Hour";
            case 24:
                return "1 Day";
            case 240:
                return "10 Day";
            default:
                return "Choose time...";
        }
    }

    useEffect(() => {
        const sibling = list_ref.current?.previousSibling;
        if (!sibling) return;

        sibling.textContent = option;
    }, [option])

    return (
        <>
            <form onSubmit={handle_submit}>
                <label htmlFor="input-text">{space_name}</label>
                <TextareaAutosize
                    name="content"
                    value={current_text}
                    id="input-text"
                    onChange={handle_change}
                    placeholder="Insert any text..."
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                    minRows={5}
                />

                <div className="save-time">
                    <button onClick={initiate_options} type="button" className="selector">
                        <p>Choose time...</p>
                        <ul ref={list_ref} id="time-list" className="hide_list">
                            <li onClick={call_options} value="0" id="nun">Don't remove</li>
                            <li onClick={call_options} value="1" id="hr">1 Hour</li>
                            <li onClick={call_options} value="10" id="thr">10 Hour</li>
                            <li onClick={call_options} value="24" id="dy">1 Day</li>
                            <li onClick={call_options} value="240" id="tdy">10 Day</li>
                        </ul>
                    </button>
                    <button type="submit" className="submit-button">
                        <span>&#9166;</span>
                    </button>
                </div>
            </form>
            <p className="update-p">{updated_date}</p>
        </>
    );
}

export default InboxArea