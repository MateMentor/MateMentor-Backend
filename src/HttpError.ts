/** @format */

// File: HttpError.ts

export class HttpError extends Error {
        status: number;

        constructor(status: number, message: string) {
                super(message); // Add a "message" property
                this.status = status; // Add a "status" property
                Object.setPrototypeOf(this, HttpError.prototype); // as of TypeScript 2.2
        }
}
