export class DatabaseError extends Error {
    err: any;

    constructor(err: any) {
        super(); // construit le parent
        this.err = err;
    }
}