import UserModel from '@/resources/user/user.model'
import User from '@/resources/user/user.interface'
import token from '@/utils/token'

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string,
    ): Promise<string | undefined> {
        const user = await this.user.create({
            name,
            email,
            password,
            role
        });

        const accessToken = token.createToken(user);

        return accessToken;
    }

    /**
     * Login user
     */
    public async login(
        auth: {
            email: string,
            password: string
        }
    ): Promise<string | undefined> {
        const user = await this.user.findOne({ email: auth.email });

        if (!user) return;

        if (await user.isValidPassword(auth.password)) {
            return token.createToken(user);
        }

        return;
    }

    /**
     * Get single user by id
     */
    public async getUser(_id: string): Promise<User | null> {
        const user = await this.user.findById(_id)

        return user;
    }

    /**
     * Get all users
     */
    public async getUsers(): Promise<Array<User> | null> {
        const users = await this.user.find().select('-password').exec();

        return users;
    }

    /**
     * Delete single user by id
     */
    public async deleteUser(_id: string): Promise<User | null> {
        let user = await this.user.findByIdAndRemove(_id);

        return user;
    }

    /**
     * Update single user by id
     */
    public async updateUser(id: string, user: User): Promise<User | null> {
        let updatedUser = await this.user.findByIdAndUpdate(id, user);

        return updatedUser;
    }
}

export default UserService;