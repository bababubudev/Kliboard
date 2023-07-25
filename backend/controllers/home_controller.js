
async function get_home(req, res)
{
    res.json({ message: "Hello world!" });
}

async function post_home(req, res)
{
    const { space_name } = req.body;
    res.status(300).json({ message: space_name });
}

export { get_home, post_home };