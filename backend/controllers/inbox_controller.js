export default async function post_inbox(req, res)
{
    const { name } = req.body;
    res.status(201).json({ message: name });
}