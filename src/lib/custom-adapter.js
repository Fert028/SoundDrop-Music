import pool from './db';

export default function CustomAdapter() {
  return {
    async createUser(user) {
      const { name, email, image, emailVerified } = user;
      
      console.log('👤 Creating user:', { name, email });
      
      const result = await pool.query(
        `INSERT INTO users (name, email, image, email_verified, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, NOW(), NOW()) 
         RETURNING id, name, email, image, email_verified as "emailVerified"`,
        [name, email, image, emailVerified]
      );
      
      console.log('✅ User created:', result.rows[0]);
      return result.rows[0];
    },

    async getUser(id) {
      const result = await pool.query(
        `SELECT id, name, email, image, email_verified as "emailVerified" 
         FROM users WHERE id = $1`,
        [id]
      );
      
      return result.rows[0] || null;
    },

    async getUserByEmail(email) {
      const result = await pool.query(
        `SELECT id, name, email, image, email_verified as "emailVerified" 
         FROM users WHERE email = $1`,
        [email]
      );
      
      return result.rows[0] || null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      console.log('🔍 Searching user by account:', { provider, providerAccountId });
      
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.image, u.email_verified as "emailVerified"
         FROM users u
         JOIN accounts a ON u.id = a.user_id
         WHERE a.provider = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId]
      );
      
      console.log('📋 Found user:', result.rows[0]);
      return result.rows[0] || null;
    },

    async updateUser(user) {
      const { id, name, email, image, emailVerified } = user;
      
      const result = await pool.query(
        `UPDATE users 
         SET name = COALESCE($2, name), 
             email = COALESCE($3, email), 
             image = COALESCE($4, image), 
             email_verified = COALESCE($5, email_verified),
             updated_at = NOW()
         WHERE id = $1 
         RETURNING id, name, email, image, email_verified as "emailVerified"`,
        [id, name, email, image, emailVerified]
      );
      
      return result.rows[0];
    },

    async deleteUser(userId) {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    },

    async linkAccount(account) {
      const {
        userId,
        type,
        provider,
        providerAccountId,
        refresh_token,
        access_token,
        expires_at,
        token_type,
        scope,
        id_token,
        session_state,
      } = account;

      console.log('🔗 Linking account:', { userId, provider, providerAccountId });

      const result = await pool.query(
        `INSERT INTO accounts (
          user_id, type, provider, provider_account_id, refresh_token, 
          access_token, expires_at, token_type, scope, id_token, session_state
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, user_id, provider, provider_account_id`,
        [
          userId,
          type,
          provider,
          providerAccountId,
          refresh_token,
          access_token,
          expires_at,
          token_type,
          scope,
          id_token,
          session_state,
        ]
      );

      console.log('✅ Account linked:', result.rows[0]);
      return account;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await pool.query(
        'DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2',
        [provider, providerAccountId]
      );
    },

    async createSession(session) {
      const { sessionToken, userId, expires } = session;

      const result = await pool.query(
        `INSERT INTO sessions (user_id, session_token, expires, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING id, user_id as "userId", session_token as "sessionToken", expires`,
        [userId, sessionToken, expires]
      );

      return result.rows[0];
    },

    async getSessionAndUser(sessionToken) {
      const sessionResult = await pool.query(
        `SELECT id, user_id as "userId", session_token as "sessionToken", expires
         FROM sessions WHERE session_token = $1 AND expires > NOW()`,
        [sessionToken]
      );

      if (sessionResult.rows.length === 0) return null;

      const session = sessionResult.rows[0];
      
      const userResult = await pool.query(
        `SELECT id, name, email, image, email_verified as "emailVerified"
         FROM users WHERE id = $1`,
        [session.userId]
      );

      if (userResult.rows.length === 0) return null;

      return {
        session,
        user: userResult.rows[0],
      };
    },

    async updateSession(session) {
      const { sessionToken, expires } = session;

      const result = await pool.query(
        `UPDATE sessions 
         SET expires = COALESCE($2, expires)
         WHERE session_token = $1 
         RETURNING id, user_id as "userId", session_token as "sessionToken", expires`,
        [sessionToken, expires]
      );

      return result.rows[0] || null;
    },

    async deleteSession(sessionToken) {
      await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
    },

    async createVerificationToken(verificationToken) {
      const { identifier, token, expires } = verificationToken;

      await pool.query(
        `INSERT INTO verification_tokens (identifier, token, expires, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [identifier, token, expires]
      );

      return verificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      const result = await pool.query(
        `DELETE FROM verification_tokens 
         WHERE identifier = $1 AND token = $2 AND expires > NOW()
         RETURNING identifier, token, expires`,
        [identifier, token]
      );

      return result.rows[0] || null;
    },
  };
}