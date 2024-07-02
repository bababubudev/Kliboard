import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { SaveIcon, SavedIcon } from "../Icons";

interface IAreaDetails {
    space_name: string;
    current_text: string;
    current_time: number;

    disable_submit: boolean;
    is_loading: boolean;

    handle_submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    handle_change: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    handle_option: (change: string) => void;
}

function InboxArea({
    space_name,
    current_text,
    current_time,

    handle_submit,
    handle_change,
    handle_option,

    disable_submit,
    is_loading
}: IAreaDetails) {
    const list_ref = useRef<HTMLUListElement>(null);

    const [show_list, set_show_list] = useState<boolean>(false);
    const [option, set_option] = useState<string>(get_option(current_time));

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
                return "5 Minutes";
            case 1:
                return "1 Hour";
            case 10:
                return "10 Hours";
            case 24:
                return "1 Day";
            case 240:
                return "10 Days";
            case -1:
                return "Choose Time";
            default:
                return "Unavailable";
        }
    }

    useEffect(() => {
        set_option(get_option(current_time));
    }, [current_time]);

    useEffect(() => {
        const list = list_ref.current;

        if (!list || current_time < -1) return;

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
        };

    }, [show_list]);

    return (
        <>
            <form onSubmit={handle_submit}>
                <label htmlFor="input-text">
                    {space_name}
                </label>
                <TextareaAutosize
                    name="content"
                    value={current_text}
                    id="input-text"
                    onChange={handle_change}
                    placeholder={is_loading ? "Hold on..." : "Insert any text..."}
                    autoComplete="off"
                    spellCheck="false"
                    readOnly={current_time < -1}
                    autoFocus
                    minRows={5}
                />
                <div className="save-time">
                    <button type="button" className="selector" id="list-btn">
                        <p>{!is_loading ? option : "Hold on"}</p>
                        <ul
                            ref={list_ref}
                            id="time-list"
                            className={show_list ? "show-list" : "hide-list"}
                        >
                            <li
                                onClick={call_options}
                                onFocus={call_options}
                                value="0"
                                id="on-view"
                                tabIndex={0}
                            >
                                5 Minutes
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
                                10 Hours
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
                                10 Days
                            </li>
                        </ul>
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={disable_submit || is_loading}
                    >
                        {is_loading
                            ? <div className="loading"><span>&#9862;</span></div>
                            : <div className="on-save">{disable_submit ? <SavedIcon /> : <SaveIcon />}</div>
                        }
                    </button>
                </div>
            </form>
        </>
    );
}

export default InboxArea;