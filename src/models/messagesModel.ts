import { Document, Schema, model, Model } from "mongoose";

// Document
export interface IMessage extends Document {
    // _id: string;
    conversationId : string;
    content: string;
    targets: string[];
    emitter: string;
    createdAt: Date;
};

// Database
const messageSchema = new Schema({
    conversationId : { type: String, required: true},
    content: { type: String, required: true},
    targets: [{ type: String, required: true}],
    emitter: { type: String, required: true},
    createdAt: { type: Date, required: true},
});

// Link Schema and the Model
export const Message = model<IMessage, Model<IMessage>>('Message', messageSchema);