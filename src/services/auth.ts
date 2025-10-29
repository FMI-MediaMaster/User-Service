import { UserCreateSchema, UserUpdateSchema, User } from '@schemas/user'; // TODO
import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'
import config from '@media-master/load-dotenv';

// TODO: use
const supabase = createClient<Database>(config.SUPABASE_URL, config.SUPABASE_KEY)

export default class AuthService {
    // TODO
    login = async (req: Request, res: Response): Promise<void> => {
        console.log("login - service");
    };

    // TODO: async + promise
    signup = (req: Request, res: Response): void => {
        console.log("signup - service");
    };

    // TODO: async + promise
    logout = (req: Request, res: Response): void => {
        console.log("logout - service");
    };
}
