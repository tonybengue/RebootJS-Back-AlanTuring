export class UserNotFoundError extends Error {
    id: number;

    constructor(id: number, messsage: string) {
        super(); // construit le parent
        this.id = id;
    }
}