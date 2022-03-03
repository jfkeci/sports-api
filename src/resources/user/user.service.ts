import UserModel from '@/resources/user/user.model'
import User from '@/resources/user/user.interface'
import token from '@/utils/token'

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     * 
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string,
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                role
            });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }

    /**
     * Attempt to login a user
     * 
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) throw new Error('No user with this email');

            if (await user.isValidPassword(password)) return token.createToken(user);

            throw new Error('Can\'t login with these credentials');
        } catch (error) {
            throw new Error('Can\'t login with these credentials');
        }
    }
}

export default UserService;