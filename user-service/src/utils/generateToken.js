import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

// In-memory store for refresh tokens (for demo; use DB/Redis in real apps)
// const refreshTokenStore = new Map();

export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, secretKey, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '1d' });

    // refreshTokenStore.set(userId, refreshToken);

    return { accessToken, refreshToken };
};

export const verifyRefreshToken = (refreshToken) => {
    try {
        console.log(refreshSecret)
        console.log(refreshToken)
        const decoded = jwt.verify(refreshToken, refreshSecret);
        // const storedToken = refreshTokenStore.get(decoded.user.userId);
        console.log(decoded)
        // if (storedToken !== refreshToken) return null;
        return decoded.userId;
    } catch {
        return null;
    }
};
