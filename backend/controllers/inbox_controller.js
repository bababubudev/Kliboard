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

async function post_inbox(req, res)
{
    const { space_name, space_text, removal } = req.body;

    try
    {
        const inbox = await model.create({ space_name, space_text, removal });
        res.status(200).json(inbox);
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}

async function update_inbox(req, res)
{
    const id = req.params.id;

    try
    {
        const unchangeable = "space_name";
        const reqKeys = Object.keys(req.body);
        const isValid = reqKeys.every(key => !(unchangeable === key) && model.schema.path(key));

        if (!isValid)
        {
            res.status(400)
            throw new Error("Sent request is not valid!")
        }

        const inbox = await model.findOneAndUpdate({ _id: id }, req.body);
        await res.status(200).json({ message: `${inbox.space_name} successfully updated!` });
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}

async function delete_inbox(req, res)
{
    const id = req.params.id;

    try
    {
        const inbox = await model.findOneAndDelete({ _id: id });
        res.status(200).json({ message: `${inbox.space_name} successfully deleted!` });
    }
    catch (err)
    {
        res.status(400).json({ error: err.message });
    }
}

export
{
    get_inbox, post_inbox,
    update_inbox, delete_inbox
}