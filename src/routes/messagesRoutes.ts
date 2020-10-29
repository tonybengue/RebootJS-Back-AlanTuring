import { Router } from "express";
import { DatabaseError } from "../controllers/errors/databaseError";
import { authenticationRequired } from "../middlewares/authenticationRequired";
import { Message } from "../models/messagesModel";
import { IUser, User } from "../models/usersModel";
import { io } from '../socket';

const router = Router();

// Get a message
router.get('/', authenticationRequired, async (req, res) => {
    const connectedUser = req.user as IUser;

    // https://docs.mongodb.com/manual/reference/operator/query/or/
    try {
        const messages = await Message.find({
            $or : [
                { emitter: connectedUser._id }, // soit emitter
                { target: connectedUser._id } // soit target
            ]
        });
        return res.send(messages);
    } catch(err) {
        throw new DatabaseError(err);
    }
});

// Create a message
router.post('/', authenticationRequired, async (req, res) => {
    const connectedUser = req.user as IUser;
    const { content, conversationId, targets } = req.body;
    if(!content || !conversationId || !targets || targets.length === 0) {
        return res.status(400).send(`Please ensure that your request contains : content, conversationId and targets. Also check if that targets is not an empty array`)
    }

    const message = new Message({
        emitter: connectedUser._id,
        content: content,
        conversationId: conversationId,
        targets: targets,
        createdAt: new Date()
    });

    try {
        const createdMessage = await message.save(); // save message in bdd
        res.send(createdMessage); // send the message
        /* IO emition
            pour chaque target {
            - récuperer l'id de la socket stocké dans le user
            - si elle existe c'est que le lien entre le back et le front existe donc
            je peux emettre un evenement avec io.to(socketID).emit('new-message', data)
            - sinon pas la peine d'envoyer un event
        }*/

        createdMessage
            .targets.filter(targ => targ != connectedUser._id) // to not the 
            .forEach( async (target) => {
                const user = await User.findById(target)
                if(!user) return; // if no user
                if(!user.socket) return; // if no socket

                return io.to(user.socket).emit('new-message', { message: createdMessage })
            })
    } catch(err) {
        throw new DatabaseError(err);
    }
});

export default router;