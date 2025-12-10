const Stack = require("../models/Stack");
const Resource = require("../models/Resource");
const User = require("../models/User");
const { sequelize } = require("../config/db.config");
const InteractionUserStack = require("../models/InteractionUserStack");

const create = async (req, res) => {
    try {
        const { name, description } = req.body;

        const stack = await Stack.create({
            name,
            description,
            author_user_Id: req.user.user_Id
        });

        return res.status(201).json(stack);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getRecentStacksPreview = async (req, res) => {
    try {
        const { page, page_size } = req.params;
        const limit = parseInt(page_size);
        const offset = (parseInt(page) - 1) * limit;

        const stacks = await Stack.findAll({
            where: { is_verified: true },
            include: [
                {
                    model: User,
                    attributes: ['nickname', 'role'],
                    required: false
                }
            ],
            attributes: [
                'stack_Id',
                'name',
                'description',
                'creation_date',
                'author_user_Id',
                'likes_cache',
                'views_cache'
            ],
            offset: offset,
            limit: limit,
            order: [['creation_date', 'DESC']]
        });

        return res.status(200).json(stacks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllByAuthor = async (req, res) => {
    try {
        const { user_Id } = req.params;

        const stacks = await Stack.findAll({
            where: { author_user_Id: user_Id },
            include: [
                {
                    model: Resource,
                    attributes: ['resource_Id', 'name'],
                    through: { attributes: [] }
                }
            ],
            order: [['creation_date', 'DESC']]
        });

        return res.status(200).json(stacks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { stack_Id } = req.params;

        const stack = await Stack.findOne({
            where: { stack_Id },
            include: [
                {
                    model: User,
                    attributes: ['nickname', 'role']
                },
                {
                    model: Resource,
                    attributes: ['resource_Id', 'name', 'link_to_resource', 'producer'],
                    through: { attributes: [] }
                },
                {
                    model: InteractionUserStack,
                    attributes: ['interaction_user_stack_Id', 'is_liked', 'is_viewed', 'is_in_view_later', 'is_in_favourites'],
                }
            ]
        });

        if (!stack) {
            return res.status(404).json({ message: "Stack not found" });
        }

        return res.status(200).json(stack);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { stack_Id } = req.params;
        const { name, description } = req.body;

        const stack = await Stack.findOne({ where: { stack_Id } });

        if (!stack) {
            return res.status(404).json({ message: "Stack not found" });
        }

        if (stack.author_user_Id != req.user.user_Id && req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updates = { name, description };
        Object.keys(updates).forEach(key => updates[key] == null && delete updates[key]);

        await stack.update(updates);

        return res.status(200).json(stack);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { stack_Id } = req.params;
        
        const stack = await Stack.findOne({ where: { stack_Id } });

        if (!stack) {
            return res.status(404).json({ message: "Stack not found" });
        }

        if (stack.author_user_Id != req.user.user_Id && req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        await Stack.destroy({ where: { stack_Id } });
        return res.status(200).json({ message: "Stack deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addResource = async (req, res) => {
    try {
        const { stack_Id, resource_Id } = req.params;

        const stack = await Stack.findByPk(stack_Id);
        if (!stack) return res.status(404).json({ message: "Stack not found" });

        if (stack.author_user_Id != req.user.user_Id && req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const resource = await Resource.findByPk(resource_Id);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        await stack.addResource(resource);

        return res.status(200).json({ message: "Resource added to stack" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const removeResource = async (req, res) => {
    try {
        const { stack_Id, resource_Id } = req.params;

        const stack = await Stack.findByPk(stack_Id);
        if (!stack) {
            return res.status(404).json({ message: "Stack not found" });
        }

        if (stack.author_user_Id != req.user.user_Id && req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const resource = await Resource.findByPk(resource_Id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await stack.removeResource(resource);

        return res.status(200).json({ message: "Resource removed from stack successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getResourceIds = async (req, res) => {
    try {
        const { stack_Id } = req.params;

        const stack = await Stack.findByPk(stack_Id, {
            include: [{
                model: Resource,
                attributes: ['resource_Id'],
                through: { attributes: [] }
            }]
        });

        if (!stack) {
            return res.status(404).json({ message: "Stack not found" });
        }

        const ids = stack.Resources.map(r => r.resource_Id);
        return res.status(200).json(ids);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    getRecentStacksPreview,
    getAllByAuthor,
    getById,
    update,
    deleter,
    addResource,
    removeResource,
    getResourceIds
};