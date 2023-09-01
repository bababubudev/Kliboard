import model from "../models/inbox_model.js";

const format_date = (dateToCheck) =>
{
    const currentDate = new Date();
    const targetDate = new Date(dateToCheck);

    if (
        targetDate.getDate() === currentDate.getDate() &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getFullYear() === currentDate.getFullYear()
    )
    {
        return "today";
    }

    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);
    if (
        targetDate.getDate() === tomorrow.getDate() &&
        targetDate.getMonth() === tomorrow.getMonth() &&
        targetDate.getFullYear() === tomorrow.getFullYear()
    )
    {
        return "tomorrow";
    }

    return new Date(dateToCheck)
        .toLocaleString("en-GB", {
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        });
};

function get_time_difference(futureDate)
{
    const currentDate = new Date();
    const targetDate = new Date(futureDate);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference < 0)
    {
        return "This space is deleting in less than a minute...";
    }

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1)
    {
        if (hours > 0)
        {
            return `${days} days and ${hours % 24} hours`;
        }

        return `${days} days`;
    }
    else if (hours >= 1)
    {
        return `${hours % 24} hours`;
    }
    else
    {
        return `${minutes % 60} minutes and ${seconds % 60} seconds`;
    }
}

function create_response(removal, space_name) {
    let expireAt;
    switch (removal) {
    case 0:
        expireAt = Date.now() + (5 * 60 * 1000);
        break;
    default:
        expireAt = Date.now() + (removal * 60 * 60 * 1000);
        break;
    }

    const currentDate = new Date(expireAt);
    const formattedName = space_name.charAt(0).toUpperCase() + space_name.slice(1).toLowerCase();
    const dateString = format_date(currentDate);

    let dateInfo = ` until ${dateString}`;
    if (dateString[0] === "t")
    {
        dateInfo += ` at ${currentDate.toLocaleTimeString("en-GB", {
            hour: "2-digit", minute: "2-digit", hourCycle: "h23"
        })}`;
    }

    if (removal === 0) { dateInfo = " for 5 minutes"; }

    return { expireAt, dateInfo, formattedName };
}

async function get_inbox(req, res)
{
    const id = req.params.id;
    if (!id) return res.status(404).json({ error: "not found" });

    try
    {
        const inbox = await model.findById(id);
        res.status(200).json(inbox);
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}

async function get_inbox_name(req, res)
{
    const name = req.params.name;
    
    try
    {
        const exists = await model.exists({space_name: name.toLowerCase()});

        if (!exists)
        {
            const message = "Press \u27A4 button to save";
            return res.status(206).json({ greet: message });
        }

        const inbox = await model.findById(exists._id);
        const { space_text, removal, updatedAt, expireAt } = inbox;

        const dateDifference = get_time_difference(new Date(expireAt));

        let message = removal < 0 ? `welcome to ${inbox.space_name}! space cannot be changed`
            : `Welcome back ${inbox.space_name}! space removing in ${dateDifference}`;

        if (dateDifference[0] === "T" && removal >= 0)
            message = dateDifference;

        const modInbox = {
            message: message,
            space_name: name,
            space_text,
            removal,
            updatedAt
        };

        return res.status(200).json(modInbox);
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}

async function post_inbox(req, res)
{
    const { space_name, space_text, removal } = req.body;

    try
    {
        const lowerName = space_name.toLowerCase();
        const allowedNums = [0, 1, 10, 24, 240];
        const exists = await model.exists({space_name: lowerName});

        if (exists)
        {
            const {space_name, space_text, removal, updatedAt} = await model.findById(exists._id);
            
            const modInbox = {
                message: "It is already posted before!",
                space_name,
                space_text,
                removal,
                updatedAt
            };

            return res.status(200).json(modInbox);
        }

        if (!allowedNums.includes(removal)) {
            throw new Error("Sent request is not valid!");
        }

        const {expireAt, dateInfo, formattedName} = create_response(removal, space_name);

        const inbox = await model.create({ space_name, space_text, removal, expireAt });
        if (inbox === null) throw new Error("Something went wrong! Try again...");

        const modInbox = {
            message: `${formattedName} saved ${dateInfo}`,
            space_name: inbox.space_name,
            space_text: inbox.space_text,
            removal: inbox.removal,
            updatedAt: inbox.updatedAt
        };

        return res.status(200).json(modInbox);
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}

async function update_inbox(req, res)
{
    const name = req.params.name;

    try
    {
        const unchangeable = ["_id", "space_name", "createdAt", "updatedAt", "expireAt"];
        const reqKeys = Object.keys(req.body);
        const isValid = reqKeys.every(key => !(unchangeable === key) && model.schema.path(key));

        let { removal } = req.body;
        const allowedNums = [0, 1, 10, 24, 240];
        const invalidUpdate = ["prabesh", "vai"];

        const invalid = !isValid 
        || !allowedNums.includes(removal) 
        || invalidUpdate.includes(name);

        if (invalid)
        {
            res.status(400);
            throw new Error("Sent request is not valid!");
        }

        const {expireAt, dateInfo, formattedName} = create_response(removal, name, true);

        const inbox = await model.findOneAndUpdate({ space_name: name }, { ...req.body, expireAt: expireAt }, { new: true }); 
        if (inbox === null) { throw new Error("space is nowhere to be found :/"); }

        const modInbox = {
            message: formattedName + " is now saved " + dateInfo,
            space_name: inbox.space_name,
            space_text: inbox.space_text,
            removal: inbox.removal,
            updatedAt: inbox.updatedAt
        };

        res.status(200).json(modInbox);
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}
export
{
    get_inbox, get_inbox_name, post_inbox,
    update_inbox
};