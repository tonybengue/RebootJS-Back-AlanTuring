import { IMessage, Message } from '../models/messages';
import { IProfile } from '../models/users';

export async function getAllMessages(user: IProfile, conversationId?: string): Promise<IMessage[]> {
  try {
    if (!user) throw Error('Anonymous request');
    const userId = user._id;
    const query = {
      $or: [
        { emitter: userId },
        { targets: userId }
      ],
      $and : [{ conversationId: conversationId }]
    }
    if(!conversationId) delete query.$and
    const messages = await Message.find(
      query,
      null,
      { sort: { createdAt: 1 } });
    return messages;
  } catch (error) {
    throw new Error("Error while searching for messages in DB")
  }
}

export async function createMessage(user: IProfile, conversationId: string, targets: string[], content: string): Promise<IMessage> {
  try {
    const emitter = user._id;
    const createdAt = new Date().toString();
    const message = await Message.create({ conversationId, emitter, targets, content, createdAt });
    return message;
  } catch (error) {
    throw new Error('Error while creating a message in DB');
  }
}