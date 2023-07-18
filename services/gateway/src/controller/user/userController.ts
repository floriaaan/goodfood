import express, {Request, Response} from 'express';
import userService from '../../services/user_service';
import {UserId} from "@order/proto/user_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";


export const userController = (app: express.Application) => {
    app.get('/api/user/:id', (req: Request, res: Response) => {
        const {id} = req.params;
        const userId = new UserId();
        userId.setId(Number(id));

        userService.getUser(userId, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });

    app.get('/api/user', (req: Request, res: Response) => {
        userService.listUser(new Empty(), (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });
}