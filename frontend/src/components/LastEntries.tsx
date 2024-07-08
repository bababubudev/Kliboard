export interface Entry {
    name: string,
    updated?: Date,
}

interface EntriesProp {
    entries: Entry[]
}

const formatPastDate = (dateToCheck: Date): string => {
    const currentDate = new Date();
    const targetDate = new Date(dateToCheck);

    const differenceInMilliseconds = currentDate.getTime() - targetDate.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
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

function LastEntries({ entries }: EntriesProp) {
    function getDate(date: Date | undefined) {
        if (!date) return "";
        return formatPastDate(date);
    }

    return (
        <div className="last-updated">
            <p id="box">LAST UPDATED SPACES</p>
            <ul>
                {entries.length > 0
                    ? entries.map((entry, index) => (
                        <li key={index}>
                            <p>{entry.name}</p>
                            {entry.updated &&
                                <p className="date-updated">
                                    {getDate(entry.updated)}
                                </p>
                            }
                        </li>
                    ))    
                    : <li><span>&#9862; &#9862; &#9862;</span></li>
                }
            </ul>
        </div>
    );
}

export default LastEntries;