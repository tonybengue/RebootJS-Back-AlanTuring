import { Request, Response, Router } from 'express';
import { createUser, getUser, updateUser, getUsers } from '../controllers/usersController';
import { UserNotFoundError } from "../controllers/errors/userNotFound";

// Init the router
const router = Router();

// Get all users
// GET /api/users
router.get('/', (req: Request, res: Response) => {
    let users = getUsers();
    
    // res.send('users', { users });
    res.send('users');
});

// Get an user by id
// GET /api/users/1
router.get('/:userId', (req: Request, res: Response) => {
    const id = parseInt(req.params["userId"]); // or with parseint if it not a nm
    
    // const user = getUser(id);
    getUser(
        id,
        (user) => {
            if(!user) { return res.status(404).send('User Not Found') }
            
            return res.send(user);
        }
    );
    // res.send(user);
});
    
// Create an user
// POST /api/users/:userId
router.post('/', (req : Request, res : Response) => {
    // Datas receivd
    const { firstName, lastName, email } = req.body;
    
    // Verification body
    if(!firstName || !lastName || !email){
        return res.status(400).send("Please provide a firstname, lastname and email");
    }
    
    // Appelle le controller
    const newUser = createUser(firstName, lastName, email);
    
    // Send the response
    res.send(newUser);
})

// Modify an user by it's id
// PATCH /api/users/:userId
router.patch('/:userId', (req: Request, res: Response) => {
    // const id = parseInt(req.params["userId"]);
    const { firstName, lastName, email } = req.body;
    // const id = await User.findById(req.params.userId);
    const id = parseInt(req.params["userId"]);

    // Catche err
    try {
        updateUser(id, firstName, lastName, email);
    } catch(error) {
        if(error instanceof UserNotFoundError) {
            res.status(404).send("User not found"); // set the status code
        } else {
            throw error;
        }
    }
}) 

export default router