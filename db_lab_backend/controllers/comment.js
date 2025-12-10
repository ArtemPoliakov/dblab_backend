const { sequelize } = require("../config/db.config");
const Comment = require("../models/Comment");
const InteractionUserResource = require("../models/InteractionUserResource")
const InteractionUserStack = require("../models/InteractionUserStack");

const createForResource = async (req, res) => {
    try {
        const { text,
                resource_Id
              } = req.body;
        const user_Id = req.user.user_Id;
        let interaction = await InteractionUserResource
              .findOne({
                where: {user_Id, resource_Id},
                attributes: ["interaction_user_resource_Id"]
              });
        if(interaction == null) {
            interaction = await InteractionUserResource.create({
                is_liked: false,
                is_viewed: false,
                is_in_view_later: false,
                is_in_favourites: false,
                resource_Id,
                user_Id
            });
        }

        const comment = await Comment.create({ 
               text,
               interaction_user_resource_Id: interaction.interaction_user_resource_Id
        });
        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createForStack = async (req, res) => {
    try {
        const { text, stack_Id } = req.body;
        const user_Id = req.user.user_Id;

        let interaction = await InteractionUserStack.findOne({
            where: { user_Id, stack_Id },
            attributes: ["interaction_user_stack_Id"]
        });

        if (interaction == null) {
            interaction = await InteractionUserStack.create({
                is_liked: false,
                is_viewed: false,
                is_in_view_later: false,
                is_in_favourites: false,
                stack_Id,
                user_Id
            });
        }

        const comment = await Comment.create({ 
            text,
            interaction_user_stack_Id: interaction.interaction_user_stack_Id
        });

        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getForResource = async (req, res) => {
    try {
        const { resource_Id, page, page_size  } = req.params;
        
        if(page_size == null || page_size < 1 || page == null || page < 1) {
            return res.status(400).json({message: "Bad request - invalid page size or page"});
        }
        const limit = parseInt(page_size);
        const offset = (parseInt(page) - 1) * limit;

        const comments = await sequelize.query(
            `
            SELECT 
                c.*, 
                u.user_Id,
                u.nickname
            FROM Comment AS c
            JOIN interaction_user_resource AS iur
                ON c.interaction_user_resource_Id = iur.interaction_user_resource_Id
            JOIN User AS u
                ON iur.user_Id = u.user_Id
            WHERE iur.resource_Id = :resource_Id
            ORDER BY c.creation_date DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                resource_Id,
                limit,
                offset
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getForStack = async (req, res) => {
    try {
        const { stack_Id, page, page_size } = req.params;
        
        if(page_size == null || page_size < 1 || page == null || page < 1) {
            return res.status(400).json({message: "Bad request - invalid page size or page"});
        }
        const limit = parseInt(page_size);
        const offset = (parseInt(page) - 1) * limit;

        const comments = await sequelize.query(
            `
            SELECT 
                c.*, 
                u.user_Id, 
                u.nickname
            FROM Comment AS c
            JOIN interaction_user_stack AS ius
                ON c.interaction_user_stack_Id = ius.interaction_user_stack_Id
            JOIN User AS u
                ON ius.user_Id = u.user_Id
            WHERE ius.stack_Id = :stack_Id
            ORDER BY c.creation_date DESC
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements: {
                    stack_Id,
                    limit,
                    offset
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    throw new NotImplementedError();  
};

const deleteResourceComment = async (req, res) => {
    try {
        const { comment_Id } = req.params;
        const user_Id = req.user.user_Id;

        const intr = await InteractionUserResource.findOne({
            include: {
                model: Comment,
                where: { comment_Id },
                attributes: []
            },
            attributes: ['user_Id']
        });

        if(intr.user_Id != user_Id && req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({message: "Forbidden"})
        }
        const result = await Comment.destroy({ where: { comment_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTextForResourseComment = async (req, res) => {
    try {
        const { comment_Id } = req.params;
        const user_Id = req.user.user_Id;
        const { text } = req.body;

        const intr = await InteractionUserResource.findOne({
            include: {
                model: Comment,
                where: { comment_Id },
                attributes: []
            },
            attributes: ['user_Id']
        });

        if(intr.user_Id != user_Id && req.user.role.toLowerCase() != "admin") {
            return res.status(403).json({message: "Forbidden"})
        }
        const result = await Comment.update({ text }, { where: { comment_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteStackComment = async (req, res) => {
    try {
        const { comment_Id } = req.params;
        const user_Id = req.user.user_Id;

        const intr = await InteractionUserStack.findOne({
            include: {
                model: Comment,
                where: { comment_Id },
                attributes: []
            },
            attributes: ['user_Id']
        });

        if (!intr || (intr.user_Id != user_Id && req.user.role.toLowerCase() != "admin")) {
            return res.status(403).json({message: "Forbidden"});
        }

        const result = await Comment.destroy({ where: { comment_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTextForStackComment = async (req, res) => {
    try {
        const { comment_Id } = req.params;
        const user_Id = req.user.user_Id;
        const { text } = req.body;

        const intr = await InteractionUserStack.findOne({
            include: {
                model: Comment,
                where: { comment_Id },
                attributes: []
            },
            attributes: ['user_Id']
        });

        if (!intr || (intr.user_Id != user_Id && req.user.role.toLowerCase() != "admin")) {
            return res.status(403).json({message: "Forbidden"});
        }

        const result = await Comment.update({ text }, { where: { comment_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const switchLike = async (req, res) => {
    try {
        const { comment_Id } = req.params;
        const { flag } = req.body;
        let diff = (flag == 1 ? 1 : -1);

        const result = await Comment
            .increment('likes', {
                by: diff,
                where: { comment_Id }
            });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
  createForResource,
  createForStack,
  getFromDb,
  deleteResourceComment,
  updateTextForResourseComment,
  deleteStackComment,
  updateTextForStackComment,
  switchLike,
  getForResource,
  getForStack
}