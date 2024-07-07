import { useState } from "react";
import { CopyIcon, ReloadIcon } from "../Icons";

interface SavedInboxMenuProps {
	fetch_data: () => void;
    copy_data: () => Promise<void>;
    loading: boolean;
}

function SavedInboxMenu({fetch_data, loading, copy_data}: SavedInboxMenuProps) {
    const [visible, set_visible] = useState<boolean>(false);

    return  (
        <>
            <button 
                type="button"
                className="menu-btn"
                tabIndex={0}
                onClick={_ => set_visible(prev => !prev)}
                aria-controls="primary-nav"
                aria-expanded={visible ? "true" : "false"}
            >
                <span className="sr-only">Menu</span>
                <div id="hamburg" className={visible ? "open" : ""}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            <div className={`saved-data-options ${visible ? "shown": "hidden"}`}>
                <button
                    type="button"
                    className="reload-btn"
                    onClick={fetch_data}
                    disabled={!visible || loading}
                >
                    <ReloadIcon />
                </button>
                <button
                    type="button"
                    className="copy-btn"
                    onClick={copy_data}
                    disabled={!visible}
                >
                    <CopyIcon />
                </button>
            </div>
        </>
    );
}

export default SavedInboxMenu;