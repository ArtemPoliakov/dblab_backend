const LinkType = require("../models/LinkType");

const getAll = async (req, res) => {
    try {
        const linkTypes = await LinkType.findAll();
        return res.status(200).json(linkTypes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll
};