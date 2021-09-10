export const refreshTokenSecret =
    process.env.REFRESH_TOKEN_SECRET || "secret1234";
export const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || "secret4321";
export const isProduction = process.env.NODE_ENV === "production";
export const cookieName = "qid";
