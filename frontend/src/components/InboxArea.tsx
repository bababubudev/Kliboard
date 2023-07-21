import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface IAreaDetails {
    space_name: string;
    current_text: string;
    current_time: number;
    updated_date: string;
    disable_submit: boolean;

    handle_submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    handle_change: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    handle_option: (change: string) => void;
}


function InboxArea({
    space_name,
    current_text,
    current_time,
    updated_date,
    handle_submit,
    handle_change,
    handle_option,
    disable_submit
}: IAreaDetails) {
    const list_ref = useRef<HTMLUListElement>(null);

    const [option, set_option] = useState<string>(get_option(current_time));
    const [show_list, set_show_list] = useState<boolean>(false);
    const [death_time, set_death_time] = useState<string>(new Date().toDateString());

    function call_options(elem: React.MouseEvent<HTMLLIElement> | React.FocusEvent<HTMLLIElement>) {
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
    }, [option]);

    useEffect(() => {
        const list = list_ref.current;
        if (!list) return;

        function handle_click(event: MouseEvent) {
            const target = event.target as Node;
            const listButton = document.getElementById("list-btn");

            if (listButton && !listButton.contains(target)) {
                set_show_list(false);
            }
            else {
                set_show_list((prevState) => !prevState);
            }
        }

        document.addEventListener("click", handle_click);

        return () => {
            document.removeEventListener("click", handle_click);
        }

    }, [show_list]);

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
                    <button type="button" className="selector" id="list-btn">
                        <p>Choose time...</p>
                        <ul
                            ref={list_ref}
                            id="time-list"
                            className={show_list ? "show-list" : "hide-list"}
                        >
                            <li
                                onClick={call_options}
                                onFocus={call_options}
                                value="0"
                                id="nun"
                                tabIndex={0}
                            >
                                Don't
                                remove
                            </li>
                            <li
                                onClick={call_options}
                                onFocus={call_options}
                                value="1"
                                id="hr"
                                tabIndex={0}
                            >
                                1 Hour
                            </li>
                            <li
                                onClick={call_options}
                                onFocus={call_options}
                                value="10"
                                id="thr"
                                tabIndex={0}
                            >
                                10 Hour
                            </li>
                            <li
                                onClick={call_options}
                                onFocus={call_options}
                                value="24"
                                id="dy"
                                tabIndex={0}
                            >
                                1 Day
                            </li>
                            <li
                                onClick={call_options}
                                onFocus={call_options}
                                value="240"
                                id="tdy"
                                tabIndex={0}
                            >
                                10 Day
                            </li>
                        </ul>
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={disable_submit}
                    >
                        <span className="on-save"></span>
                    </button>
                </div>
            </form>
            <p className="update-p">
                {updated_date}
            </p>
        </>
    );
}

export default InboxArea