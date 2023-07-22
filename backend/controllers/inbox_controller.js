import inbox_model from "../models/inbox_model.js";
import model from "../models/inbox_model.js"

const formatDate = (dateToCheck) =>
{
    const currentDate = new Date();
    const targetDate = new Date(dateToCheck);

    if (
        targetDate.getDate() === currentDate.getDate() &&
        targetDate.getMonth() === currentDate.getMonth() &&
        targetDate.getFullYear() === currentDate.getFullYear()
    )
    {
        return 'today';
    }

    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);
    if (
        targetDate.getDate() === tomorrow.getDate() &&
        targetDate.getMonth() === tomorrow.getMonth() &&
        targetDate.getFullYear() === tomorrow.getFullYear()
    )
    {
        return 'tomorrow';
    }

    return new Date(dateToCheck)
        .toLocaleString("en-GB", {
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        });
}

function getTimeDifference(futureDate)
{
    const currentDate = new Date();
    const targetDate = new Date(futureDate);

    const timeDifference = targetDate.getTime() - currentDate.getTime();

    if (timeDifference < 0)
    {
        return 'This data is deleting in less than a minute...';
    }

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0)
    {
        return `${days} days`;
    }
    else if (days > 0 && hours > 0)
    {
        return `${days} days and ${hours % 24} hours`;
    }
    else if (hours > 0)
    {
        return `${hours % 24} hours`
    }
    else
    {
        return `${minutes % 60} minutes and ${seconds % 60} seconds`;
    }
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
        const inbox = await model.findOne({ space_name: name });
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        if (inbox === null)
        {
            const message = `Hello ${formattedName}! Press [ \u2BA8 ] to save data...`
            return res.status(206).json({ greet: message });
        }

        const { space_text, removal, createdAt, updatedAt, expireAt } = inbox;

        const dateDifference = getTimeDifference(new Date(expireAt));

        let message = `Welcome back ${formattedName}! `;
        message += removal <= 0 ? "Data will not be removed." : `Data is being saved for ${dateDifference}.`;

        if (dateDifference[0] === "T" && removal > 0)
            message = dateDifference;

        const modInbox = {
            time_left: message,
            space_name: name,
            space_text: space_text,
            removal: removal,
            createdAt: createdAt,
            updatedAt: updatedAt,
            expireAt: expireAt
        }


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
        const contains = await model.exists({ space_name });

        if (contains)
        {
            console.log("[ Duplicate entry found! ]");
            const inbox = await model.findById(contains["_id"]);
            return res.status(200).json(inbox);
        }

        let expireAt;
        if (removal === 0)
        {
            expireAt = new Date("2100-01-01");
        }
        else
        {
            expireAt = Date.now() + (removal * 60 * 60 * 1000);
        }

        const currentDate = new Date(expires);
        const formattedName = space_name.charAt(0).toUpperCase() + space_name.slice(1).toLowerCase();
        const dateString = formatDate(currentDate);

        let dateInfo = `Your data is being saved until `;

        if (dateString[0] === "t")
        {
            dateInfo += `${currentDate.toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit", hourCycle: "h23"
            })}`;
        }

        dateInfo += formatDate();

        if (removal === 0)
        {
            dateInfo = "Your data will not be removed!"
        }

        const inbox = await model.create({ space_name, space_text, removal, expireAt });
        return res.status(200).json({ message: `Welcome ${formattedName}! ` });
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
        const allowedNums = [-1, 0, 1, 10, 24, 240];

        const invalid = name === "prabesh" || !isValid || !allowedNums.includes(removal);

        if (invalid)
        {
            res.status(400);
            throw new Error("Sent request is not valid!");
        }

        let expires;
        if (removal === 0)
        {
            expires = new Date("2100-01-01");
        }
        else
        {
            expires = Date.now() + (removal * 60 * 60 * 1000);
        }

        const currentDate = new Date(expires);
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const dateString = formatDate(currentDate);

        let dateInfo = `Your data is saved until ${dateString}`;

        if (dateString[0] === "t")
        {
            dateInfo += ` at ${currentDate.toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit", hourCycle: "h23"
            })}`;
        }

        if (removal === 0)
        {
            dateInfo = "Your data will not be removed"
        }

        await model.findOneAndUpdate({ space_name: name }, { ...req.body, expireAt: expires }, { new: true });
        res.status(200).json({ message: formattedName + " updated! " + dateInfo + "." });
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
}