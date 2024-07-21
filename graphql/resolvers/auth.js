const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User already exists!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();

            return {
                ...result._doc,
                _id: result.id,
                password: null
            };
        } catch (err) {
            throw err;
        };
    },
    login: async ({ email, password }) => {
        try {                                                      //!Added try-catch
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Invalid credentials!');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, '\skW-).w3M00cF?}7|33', {
                expiresIn: '1h'
            });
            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            };
        } catch (err) {
            throw err;
        };
    }
};