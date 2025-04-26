import jwt from "jsonwebtoken";

export const sign = 
    async (payload = {}, signature = "", expiresIn = '1w') => 
        await jwt.sign(payload , signature , {expiresIn});