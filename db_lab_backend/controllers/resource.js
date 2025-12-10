const Resource = require("../models/Resource");
const User = require("../models/User");
const Rating = require("../models/Rating");
const DevelopmentDirection = require("../models/DevelopmentDirection");
const Link_type = require("../models/LinkType");
const Interaction_user_resource = require("../models/InteractionUserResource");
const Comment = require("../models/Comment");
const { Transaction, Op } = require("sequelize");
const { sequelize } = require("../config/db.config");

const create = async (req, res) => {
    let resource;
    try {
        const { name,
                description,
                link_to_resource,
                origination_date,
                producer,
                link_type_Id,
                direction_Ids } = req.body;

        await sequelize.transaction(async (t) => {
            resource = await Resource.create({ 
                name,
                description,
                link_to_resource,
                origination_date,
                producer,
                link_type_Id,
                author_user_Id: req.user.user_Id
            },
            { transaction: t });
            if (direction_Ids && direction_Ids.length > 0) {
                await resource.addDevelopmentDirections(direction_Ids, { transaction: t });
            }
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
        const {page, page_size} = req.params;
        const limit = parseInt(page_size);
        const offset = (parseInt(page) - 1) * limit;
        
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
                },
                {
                    model: Interaction_user_resource,
                    where: {user_Id: req.user.user_Id},
                    attributes: ['interaction_user_resource_Id',
                                 'is_viewed',
                                 'is_liked',
                                 'is_in_view_later',
                                 'is_in_favourites'
                                ],
                    required: false
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
            offset: offset,
            limit: limit,
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
        const user_Id = req.user.user_Id;

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
                    where: {user_Id: user_Id},
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

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

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
        const {
            name,
            description,
            link_to_resource,
            origination_date,
            producer,
            link_type_Id,
            direction_Ids
        } = req.body;

        const resource = await Resource.findOne({where: { resource_Id }});

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (resource.author_user_Id != req.user.user_Id &&
            req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updates = {
            name,
            description,
            link_to_resource,
            origination_date,
            producer,
            link_type_Id
        };
        Object.keys(updates).forEach(
            key => updates[key] == null && delete updates[key]
        );

        await sequelize.transaction(async (t) => {
            await resource.update(updates, { transaction: t });
            if (direction_Ids !== undefined) {
                await resource.setDevelopmentDirections(direction_Ids, { transaction: t });
            }
        });

        const updatedResource = await Resource.findByPk(resource_Id, {
            include: [{
                model: DevelopmentDirection,
                through: { attributes: [] },
                attributes: ['development_direction_Id', 'development_direction_name']
            }]
        });
        return res.status(200).json(updatedResource);

    } catch (error) {
        if (error.message === "Resource not found during transaction.") {
            return res.status(404).json({ message: "Resource not found" });
        }
        return res.status(500).json({ message: error.message });
    }
}

const getAllByAuthor = async (req, res) => {
    try {
        const { user_Id } = req.params;
        
        const resources = await Resource.findAll({
            where: { author_user_Id: user_Id },
            include: [
                {
                    model: Link_type,
                    attributes: ['link_type_Id', 'link_type_name'],
                    required: false
                },
                {
                    model: DevelopmentDirection,
                    attributes: ['development_direction_Id', 'development_direction_name'],
                    through: { attributes: [] }
                }
            ],
            order: [['publish_date', 'DESC']]
        });

        return res.status(200).json(resources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const search = async (req, res) => {
    try {
        const {
            name,
            author,
            directions,
            is_recommended,
            dateFrom,
            dateTo,
            sortBy,
            sortOrder,
            page = 1,
            page_size = 10
        } = req.query;

        const queryReplacements = {};


        const whereClause = {
            is_verified: true
        };

        if (name) {
            whereClause.name = { [Op.like]: `%${name}%` };
        }

        if (is_recommended === 'true') {
            whereClause.is_recommended = true;
        }

        if (dateFrom || dateTo) {
            whereClause.origination_date = {};
            if (dateFrom) whereClause.origination_date[Op.gt] = dateFrom;
            if (dateTo) whereClause.origination_date[Op.lt] = dateTo;
        }

        if (directions) {
            const directionIds = Array.isArray(directions) 
                ? directions 
                : directions.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            if (directionIds.length > 0) {
                whereClause.resource_Id = {
                    [Op.in]: sequelize.literal(`(
                        SELECT resource_Id 
                        FROM resourceDevelopment_direction 
                        WHERE development_direction_Id IN (:directionIds)
                    )`)
                };

                queryReplacements.directionIds = directionIds;
            }
        }


        const includeClause = [
            {
                model: User,
                attributes: ['nickname', 'role'],
                required: !!author, 
                where: author ? { nickname: { [Op.like]: `%${author}%` } } : undefined
            },
            {
                model: Rating,
                attributes: ['rating_Id', 'name'],
                through: { attributes: ['rating_position'] },
                required: false
            },
            {
                model: Link_type,
                attributes: ['link_type_name'],
                required: false
            },
            {
                model: DevelopmentDirection,
                attributes: ['development_direction_Id', 'development_direction_name'],
                through: { attributes: [] },
                required: false
            },
            {
                model: Interaction_user_resource,
                where: {user_Id: req.user.user_Id},
                attributes: ['interaction_user_resource_Id',
                                'is_viewed',
                                'is_liked',
                                'is_in_view_later',
                                'is_in_favourites'
                            ],
                required: false
            }
        ];


        const sortMapping = {
            'ViewCount': 'views_cache',
            'LikeCount': 'likes_cache',
            'PublishDate': 'publish_date',
            'OriginationDate': 'origination_date'
        };

        const orderByColumn = sortMapping[sortBy] || 'publish_date';
        const orderDirection = (sortOrder && sortOrder.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
        const orderClause = [[orderByColumn, orderDirection]];


        const limit = parseInt(page_size) || 10;
        const offset = ((parseInt(page) || 1) - 1) * limit;

        const { count, rows } = await Resource.findAndCountAll({
            where: whereClause,
            include: includeClause,
            order: orderClause,
            limit: limit,
            offset: offset,
            distinct: true,
            replacements: queryReplacements
        });

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            resources: rows
        });

    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
  create,
  getFromDb,
  deleter,
  update,
  getRecentResourcesPreview,
  getById,
  getAllByAuthor,
  search
}