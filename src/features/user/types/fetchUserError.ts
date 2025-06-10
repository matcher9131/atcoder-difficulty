export class UserNotFoundError extends Error {
    constructor() {
        super("User not found.");
        this.name = this.constructor.name;
    }
}
