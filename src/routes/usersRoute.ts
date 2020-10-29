import { Request, Response, Router } from 'express';
import { createUser, getUser, updateUser, getUsers, deleteUser } from '../controllers/usersController';
import { UserNotFoundError } from "../controllers/errors/userNotFound";

import { authenticationRequired } from "../middlewares/authenticationRequired"
import { IUser } from '../models/usersModel';
import { updateConversationSeen } from '../controllers/usersController';

// Init the router
const router = Router();

// GET /api/users
// Get all users
router.get('/', (req: Request, res: Response) => {
    getUsers((users) => {
        if(!users) { return res.status(404).send('Users not Found') }
        return res.send(users);
    });
});
// router.get('/', (req: Request, res: Response) => {
//     getUsers().then(users => {
//       return res.send(
//         users.map(user => user.getSafeUser())
//     );
//   });
// })
  

// Authentification of the user
router.get('/me', authenticationRequired, (req: Request, res: Response) => res.send((req.user as IUser).getSafeUser()))

// GET /api/users/1
// Get an user by id
// router.get('/:userId', (req: Request, res: Response) => {
router.get('/:userId', authenticationRequired, (req: Request, res: Response) => {
    const id = req.params["userId"];
    getUser(id, (user) => {
        if(!user) { return res.status(404).send('User Not Found') }
        
        return res.send(user.getSafeUser());
    });
});
    
// POST /api/users/:userId
// Create an user
router.post('/',  (req : Request, res : Response) => {
    // Datas receivd
    const { firstName, lastName, email, password } = req.body;
    
    // Verification body
    if(!firstName || !lastName || !email || !password){
        return res.status(400).send("Please provide a firstname, lastname, email and password");
    }
    
    try {
        const newUser = createUser(firstName, lastName, email, password);
        res.send(newUser.getSafeUser());
    } catch(err) {
        if(err instanceof UserNotFoundError) {
            res.status(404).send("Can't create an user"); 
        } else {
            throw err;
        }
    }
});


router.patch('/conversation-seen', authenticationRequired, async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { conversationId } = req.body;
  
    if(!conversationId) { return res.sendStatus(400); }
  
    const updatedUser = await updateConversationSeen(user, conversationId);

    return res.send(updatedUser.getSafeUser());
})

// PATCH /api/users/:userId
// Modify an user by it's id
// Compose of middleware for the auth
router.patch('/:userId', authenticationRequired, (req: Request, res: Response) => {
    const id = req.params["userId"];
    const { firstName, lastName, email } = req.body;

    try {
        const user = updateUser(id, firstName, lastName, email);
        res.send(user);
    } catch(err) {
        if(err instanceof UserNotFoundError) {
            res.status(404).send("User not found"); 
        } else {
            throw err;
        }
    }
});

// DELETE /api/users/:userId
// Delete an user by it's id
router.delete('/:userId', authenticationRequired, (req: Request, res: Response) => {
    const id = req.params["userId"];

    deleteUser(id, (user) => {
        if(!user) { return res.status(404).send('User Not Found') }
        return res.send(user.getSafeUser());
    });
});

export default router