const Resource = require("../models/Resource");
const User = require("../models/User");
const Rating = require("../models/Rating");
const DevelopmentDirection = require("../models/DevelopmentDirection");
const Link_type = require("../models/LinkType");
const Interaction_user_resource = require("../models/InteractionUserResource");
const Comment = require("../models/Comment");

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

const getRecentResourcesPreview = async (req, res) => {
    try {
        const {page, page_size} = req.body;

        const resources = await Resource.findAll({
            where: { is_verified: true },
            include: [
                {
                    model: User,
                    attributes: ['nickname', 'role'],
                    required: false
                },
                {
                    model: Rating,
                    attributes: ['rating_Id', 'name', 'forming_date'],
                    required: false,
                    through: { attributes: ['rating_position'] }
                },
                {
                    model: DevelopmentDirection,
                    attributes: ['development_direction_Id', 'development_direction_name'],
                    required: false,
                    through: { attributes: [] }
                }
            ],
            attributes: [
                'resource_Id',
                'name',
                'origination_date',
                'publish_date',
                'author_user_Id',
                'likes_cache',
                'views_cache',
                'is_recommended'
            ],
            offset: (page - 1) * page_size,
            limit: page_size,
            order: [['publish_date', 'DESC']]
        });
        
        return res.status(200).json(resources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const {resource_Id} = req.params;

        const resource = await Resource.findOne(
            {
            where: { resource_Id, is_verified: true },
            include: [
                {
                    model: User,
                    attributes: ['nickname', 'role'],
                    required: false
                },
                {
                    model: Rating,
                    attributes: ['rating_Id', 'name', 'forming_date'],
                    required: false,
                    through: { attributes: ['rating_position'] }
                },
                {
                    model: DevelopmentDirection,
                    attributes: ['development_direction_Id', 'development_direction_name'],
                    required: false,
                    through: { attributes: [] }
                },
                {
                    model: Link_type,
                    attributes: ['link_type_Id', 'link_type_name'],
                    required: false,
                },
                {
                    model: Interaction_user_resource,
                    where: {user_Id: req.user.user_Id},
                    required: false,
                    attributes: ['interaction_user_resource_Id',
                                 'is_viewed',
                                 'is_liked',
                                 'is_in_view_later',
                                 'is_in_favourites'
                                ],
                }
            ],
            attributes: [
                'resource_Id',
                'name',
                'description',
                'link_to_resource',
                'origination_date',
                'publish_date',
                'author_user_Id',
                'likes_cache',
                'views_cache',
                'is_recommended',
                'producer'
            ]
        });
        
        return res.status(200).json(resource);
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
  update,
  getRecentResourcesPreview,
  getById
}