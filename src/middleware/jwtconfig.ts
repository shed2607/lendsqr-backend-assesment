// Desc: Create a token for the user
import jwt from "jsonwebtoken";
import { User } from "../config/typeconfig";
const createToken = (user: User) => {
    try {
        const token = jwt.sign({ user }, "SECRET2024", {
            expiresIn: "1d",
        });
        return token;
    } catch (err) {
        console.log(err);
    }
};

export default createToken;
