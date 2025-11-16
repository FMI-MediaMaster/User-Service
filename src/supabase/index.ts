import { createClient } from '@supabase/supabase-js';
import config from '@media-master/load-dotenv';
import { Database } from '@types';

export const supabase = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY
);

export const supabaseAdmin = createClient<Database>(
    config.SUPABASE_URL,
    config.SUPABASE_ADMIN_KEY
);
