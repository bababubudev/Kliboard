import model from "../models/inbox_model.js";

let all_names = [];

const get_all_names = async () => {
    const inbox = await model.find({}, {space_name: -1}).sort({updatedAt: -1});
    return inbox.map(item => item.space_name);
}; 

async function get_home(req, res)
{
    try
    {  
        const inbox = await model.find().sort({updatedAt: -1});
        if (inbox === null) {
            return res.status(206).json({message: "no entries"});
        }

        all_names = inbox.map(elem => elem.space_name);
        let names = all_names.map(elem => {
            return elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase();
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

export { all_names, get_all_names, get_home };