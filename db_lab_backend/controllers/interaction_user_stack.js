const InteractionUserStack = require("../models/InteractionUserStack");
const Stack = require("../models/Stack");
const User = require("../models/User");

const create = async (req, res) => {
    try {
        const { 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites,
            stack_Id
        } = req.body;
        
        const interaction = await InteractionUserStack.create({ 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites,
            stack_Id,
            user_Id: req.user.user_Id
        });
        
        return res.status(201).json(interaction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    throw new NotImplementedError();
};

const deleter = async (req, res) => {
    try {
        const { stack_Id, user_Id } = req.query;
        
        const result = await InteractionUserStack.destroy({ where: { stack_Id, user_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const get_all_for_user = async (req, res) => {
    try {
        const { user_Id } = req.params;

        const interactions = await InteractionUserStack.findAll({
            where: { user_Id },
            include: {
                model: Stack,
                attributes: ["name"]
            }
        });
        
        const result = interactions.map(interaction => {
            const { Stack, ...interactionData } = interaction.toJSON();
            return {
                ...interactionData,
                stack_name: Stack.name,
            };
        });
        
        return res.status(200).json(result);
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites,
            stack_Id } = req.body;
        const user_Id = req.user.user_Id;
        
        const interaction = await InteractionUserStack.findOne({ 
            where: { stack_Id, user_Id } 
        });

        if (!interaction) {
            return res.status(404).json({ message: "Interaction record not found" });
        }

        const wasLiked = !!interaction.is_liked;
        const wasViewed = !!interaction.is_viewed;

        const updates = { 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites
        };

        Object.keys(updates).forEach(
            key => updates[key] == null && delete updates[key]
        );

        await interaction.update(updates);

        if (updates.hasOwnProperty('is_liked')) {
            const isNowLiked = !!updates.is_liked;

            if (wasLiked && !isNowLiked) {
                await Stack.decrement('likes_cache', { by: 1, where: { stack_Id } });
            } else if (!wasLiked && isNowLiked) {
                await Stack.increment('likes_cache', { by: 1, where: { stack_Id } });
            }
        }

        if (updates.hasOwnProperty('is_viewed')) {
            const isNowViewed = !!updates.is_viewed;

            if (wasViewed && !isNowViewed) {
                await Stack.decrement('views_cache', { by: 1, where: { stack_Id } });
            } else if (!wasViewed && isNowViewed) {
                await Stack.increment('views_cache', { by: 1, where: { stack_Id } });
            }
        }

        return res.status(200).json(interaction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const create_or_update = async (req, res) => {
     try {
        const { stack_Id } = req.body;
        const user_Id = req.user.user_Id;

        let exists = await InteractionUserStack.findOne({
            where: { stack_Id, user_Id },
            attributes: ["interaction_user_stack_Id"]
        }) != null;

        if(exists) {
            return update(req, res);
        } else {
            return create(req, res);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
  create,
  getFromDb,
  deleter,
  update,
  create_or_update,
  get_all_for_user
}