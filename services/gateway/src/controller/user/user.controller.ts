import {Request, Response, Router} from 'express';
import {userServiceClient} from '../../services/clients/user.client';
import {
    changePasswordInput,
    changeRoleInput,
    DeleteInput,
    logInInput,
    UpdateUserInput,
    User,
    UserCreateInput,
    validateInput
} from "@gateway/proto/user_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {getUser} from "@gateway/services/user.service";

export const userRoutes = Router();
userRoutes.get('/api/user/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        res.json(getUser(Number(id)));
    } catch (e: any) {
        res.json({error: e.message});
    }
});

userRoutes.get('/api/user', (req: Request, res: Response) => {
    userServiceClient.listUser(new Empty(), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.post('/api/user', (req: Request, res: Response) => {
    const body = req.body;
    let userInput = new UserCreateInput();
    try {
        userInput.setFirstName(body.firstName)
            .setLastName(body.lastName)
            .setEmail(body.email)
            .setPassword(body.password)
            .setPhone(body.phone)
            .setMainaddress(body.address)
            .setRole(body.role);

    } catch (e: any) {
        res.json({error: e.message});
    }

    userServiceClient.register(userInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.put('/api/user/:id', (req: Request, res: Response) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }

    const body = req.body;
    const userInput = new UpdateUserInput()
    try {
        const user = new User().setId(Number(req.params.id))
            .setFirstName(body.firstName)
            .setLastName(body.lastName)
            .setEmail(body.email)
            .setPhone(body.phone)
            .setMainaddress(body.address)
            .setRole(body.role);

        userInput.setUser(user).setToken(authorization);

    } catch (e: any) {
        res.json({error: e.message});
    }

    userServiceClient.updateUser(userInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.delete('/api/user/:id', (req: Request, res: Response) => {
    const {id} = req.params;
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }

    userServiceClient.deleteUser(new DeleteInput().setUserid(Number(id)).setToken(authorization), (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.post('/api/user/login', (req: Request, res: Response) => {
    const body = req.body;
    const inInput = new logInInput().setEmail(body.email).setPassword(body.password);

    userServiceClient.logIn(inInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.post('/api/user/validate', (req: Request, res: Response) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }
    const validate = new validateInput().setToken(authorization);

    userServiceClient.validate(validate, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.put('/api/user/:id/password', (req: Request, res: Response) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }

    const body = req.body;
    const updatePasswordInput = new changePasswordInput();
    try {
        updatePasswordInput
            .setToken(authorization)
            .setOldpassword(body.oldpassword)
            .setNewpassword(body.password);
    } catch (e: any) {
        res.json({error: e.message});
    }

    userServiceClient.changePassword(updatePasswordInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

userRoutes.put('/api/user/:id/role', (req: Request, res: Response) => {
    const {authorization} = req.headers;
    if (!authorization) {
        res.json({error: 'Not authorized'});
        return;
    }
    const body = req.body;
    const id = req.params.id;
    const updatePasswordInput = new changeRoleInput();
    try {
        updatePasswordInput
            .setToken(authorization)
            .setUserid(Number(id))
            .setRolecode(body.role);
    } catch (e: any) {
        res.json({error: e.message});
    }
    userServiceClient.changeRole(updatePasswordInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });

});