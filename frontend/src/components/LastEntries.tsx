export interface Entry {
    name: string,
    updated?: Date,
}

interface EntriesProp {
    entries: Entry[],
    navigate_to: (name: string) => void,
    has_error: boolean;
}

const formatPastDate = (dateToCheck: Date): string => {
    const currentDate = new Date();
    const targetDate = new Date(dateToCheck);

    const differenceInMilliseconds = currentDate.getTime() - targetDate.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    const differenceInMonths = currentDate.getMonth() - targetDate.getMonth() + (12 * (currentDate.getFullYear() - targetDate.getFullYear()));
    const differenceInYears = currentDate.getFullYear() - targetDate.getFullYear();

    if (differenceInSeconds < 60) {
        return "just now";
    } else if (differenceInMinutes === 1) {
        return "a minute ago";
    } else if (differenceInMinutes < 60) {
        return `${differenceInMinutes} minutes ago`;
    } else if (differenceInHours === 1) {
        return "an hour ago";
    } else if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
    } else if (differenceInDays === 1) {
        return "a day ago";
    } else if (differenceInDays < 7) {
        return `${differenceInDays} days ago`;
    } else if (differenceInWeeks === 1) {
        return "a week ago";
    } else if (differenceInWeeks < 4) {
        return `${differenceInWeeks} weeks ago`;
    } else if (differenceInMonths === 1) {
        return "a month ago";
    } else if (differenceInMonths < 12) {
        return `${differenceInMonths} months ago`;
    } else if (differenceInYears === 1) {
        return "a year ago";
    } else {
        return `${differenceInYears} years ago`;
    }
};


function LastEntries({ entries, navigate_to, has_error }: EntriesProp) {
    function getDate(date: Date | undefined) {
        if (!date) return "";
        return formatPastDate(date);
    }

    const on_entry_click = (name: string) => {
        if (name === "...") return;
        navigate_to(name);
    }; 

    return (
        <div className="last-updated">
            <p id="box">{entries.length > 0 ? "LAST " : has_error ? "": "LOADING "} UPDATED SPACES {has_error ? "NOT FOUND" : ""}</p>
            <ul>
                {entries.length > 0
                    ? entries.map((entry, index) => (
                        <button 
                            key={index}
                            onClick={_=>{on_entry_click(entry.name);}}
                        >
                            <p>{entry.name}</p>
                            {entry.updated &&
                                <p className="date-updated">
                                    {getDate(entry.updated)}
                                </p>
                            }
                        </button>
                    ))    
                    :  has_error 
                        ? <p style={{color:"var(--f_bg)"}}>Connection failed</p> 
                        : <li className="loading-text"></li>
                }
            </ul>
        </div>
    );
}

export default LastEntries;