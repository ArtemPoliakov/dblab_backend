const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Relations').User;
const { Op } = require('sequelize');

const login = async (req, res) => {
    const { login, email, password } = req.body;

    try {
        const user = await User.findOne({ where: { [Op.or]: [{ login }, { email }] } })
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.user_Id, role:user.role }, process.env.KEY, {
            expiresIn: '48h'
        });
        return res.status(200).json({ 
            message: 'Login successful', 
            token,
            nickname: user.nickname,
            user_Id: user.user_Id
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const register = async (req, res) => {
    const { login, email, password, nickname } = req.body;

    try {
        const existing = await User.findOne({ where: { login, email } });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ nickname, email, login, password:hashedPassword, role:"student" });
        const token = jwt.sign({ id: user.user_Id, role:user.role }, process.env.KEY, {
            expiresIn: '48h'
        });
        res.status(201).json({ message: 'User registered', token });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

module.exports = {
    login,
    register
};