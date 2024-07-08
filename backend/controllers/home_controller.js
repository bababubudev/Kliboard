import model from "../models/inbox_model.js";

async function get_home(req, res)
{
    try {
        const inbox = await model.find().sort({ updatedAt: -1 });
        if (inbox.length === 0) {
            return res.status(206).json({ message: "no entries" });
        }

        let entries = inbox.map(elem => ({
            name: elem.space_name.charAt(0).toUpperCase() + elem.space_name.slice(1).toLowerCase(),
            updated: elem.updatedAt
        }));

        const maxNames = 4;
        if (entries.length > maxNames) {
            entries = entries.slice(0, maxNames);
            entries.push({ name: "...", updated: null });
        }

        return res.status(200).json({ entries });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: ["Something went wrong :/", err.message] });
    }
    
}

export { get_home };