import model from "../models/inbox_model.js";

let all_names = [];

async function get_home(req, res)
{
    try
    {  
        const inbox = await model.find().sort({updatedAt: -1});
        if (inbox === null) {
            return res.status(206).json({message: "no entries"});
        }

        all_names = inbox.map(elem => elem.space_name);
        let names = inbox.map(elem => {
            const name = elem.space_name;
            return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        });

        const maxNames = 4;
        if (names.length > maxNames) {
            names = names.slice(0, maxNames);
            names.push("...");
        }

        return res.status(200).json(names);

    } catch (err)
    {
        return res.status(500).json({error: ["Something went wrong :/", err.message]});
    }
    
}

export { all_names, get_home };