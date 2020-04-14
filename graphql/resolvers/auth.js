import bcrypt from 'bcrypt';
import User from '../../models/user';
import jwt from 'jsonwebtoken';

module.exports = {
    Query: {
        login: async (_,{ email, password}) => {
        const user = await User.findOne({ email: email});
        if (!user) {
            throw new Error('User does not Exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email},
            'somesupersecretkey',
            { expiresIn: '1h'}); // "somesupersecretkey" used for hasshing and validation, use a longer string for prod
        return { userId: user.id, token: token, tokenExpiration: 1 };
    }
    },
    Mutation: {
        createUser: async (_, { email, password}) => {
            try{
                const existingUser = await User.findOne({ email: email });
                if(existingUser) {
                    throw new Error('User exists already.')
                }
                const hashedPassword = await bcrypt.hash(password, 12)
                const user = new User({
                    email: email,
                    password: hashedPassword
                })
                const result = await user.save();
                return { ...result._doc, password: null }
            }catch(err) {
                // console.log('called');
                console.log('called', err);
                throw err;
            }
        }
    }
};