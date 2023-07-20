import inbox_model from "../models/inbox_model.js";
import model from "../models/inbox_model.js"

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

        if (inbox === null)
            return res.status(204).send();

        const { space_text, removal, createdAt, updatedAt, expireAt } = inbox;
        const modInbox = {
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

        const inbox = await model.create({ space_name, space_text, removal, expireAt });
        return res.status(200).json(inbox);
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

        let { space_text, removal } = req.body;

        if (!isValid)
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

        const inbox = await model.findOneAndUpdate({ space_name: name }, { ...req.body, expireAt: expires }, { new: true });

        const { createdAt, updatedAt, expireAt } = inbox;
        const modInbox = {
            space_name: name,
            space_text: space_text,
            removal: removal,
            expireAt: expireAt,
            createdAt: createdAt,
            updatedAt: updatedAt
        }

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
}