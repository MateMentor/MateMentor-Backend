/** @format */

/** @format */

// customTypes.d.ts or any other name you prefer
import { Request } from "express";

declare module "express-serve-static-core" {
        interface Request {
                user?: any; // Adjust the type according to what you expect (e.g., a user object type)
        }
}
