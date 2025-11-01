const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'Relations')).User;

const isStudent = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next()
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (decoded.role == "admin") {
            next()
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findByPk(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    isStudent,
    isAdmin,
    getUser
};