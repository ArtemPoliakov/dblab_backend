const Resource = require("../models/Resource");
const User = require("../models/User")

const create = async (req, res) => {
    try {
        const { name,
                description,
                link_to_resource,
                origination_date,
                producer,
                link_type_Id } = req.body;
        const resource = await Resource.create({ 
                name,
                description,
                link_to_resource,
                origination_date,
                producer,
                link_type_Id,
                author_user_Id: req.user.user_Id
        });
        return res.status(201).json(resource);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const resources = await Resource.findAll({
            include: [
                {
                    model: User,
                    attributes: ['nickname', 'role'],
                    required: false
                }
            ]
        });
        const result = resources.map(resource => {
            const { User, ...resourceData } = resource.toJSON();
            return {
                ...resourceData,
                author_nickname: User.nickname,
                author_role: User.role
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { resource_Id } = req.params;
        const resource_with_author_id = await Resource.findOne({
            where: { resource_Id },
            attributes: ['author_user_Id']
        });
        if(resource_with_author_id.author_user_Id != req.user.user_Id &&
           req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({message: "Forbidden"})
        }
        const result = await Resource.destroy({ where: { resource_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { resource_Id } = req.params;
        const { name,
                description,
                link_to_resource,
                origination_date,
                producer,
                link_type_Id } = req.body;
        const updates = { 
                name,
                description,
                link_to_resource,
                origination_date,
                producer,
                link_type_Id
        };
        const resource_with_author_id = await Resource.findOne({
            where: { resource_Id },
            attributes: ['author_user_Id']
        });
        if(resource_with_author_id.author_user_Id != req.user.user_Id &&
            req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({message: "Forbidden"})
        }
        Object.keys(updates).forEach(
            key => updates[key] == null && delete updates[key]
        );
        const resource = await Resource.update(updates, {where: {resource_Id}});
        return res.status(200).json(resource);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {
  create,
  getFromDb,
  deleter,
  update
}