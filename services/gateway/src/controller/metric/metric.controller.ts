import metricService from '../../services/clients/metric.client';
import {Router} from "express";
import {
    CreateRestaurantGroupRequest,
    CreateRestaurantRequest,
    DeleteRestaurantGroupRequest,
    DeleteRestaurantRequest,
    GetMetricRequest,
    GetMetricsByRestaurantAndDateRequest,
    GetMetricsByRestaurantGroupRequest,
    GetMetricsByRestaurantRequest,
    GetRestaurantGroupRequest,
    GetRestaurantRequest,
    Metric,
    UpdateRestaurantGroupRequest,
    UpdateRestaurantRequest
} from "@gateway/proto/metric_pb";

export const metricRoutes = Router();

metricRoutes.get('/api/metric/:key', (req, res) => {
    const {key} = req.params;
    const metricInput = new GetMetricRequest().setKey(key);
    metricService.getMetric(metricInput, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.post('/api/metric/by-restaurant-and-date', (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                restaurantId: "restaurant_id:1",
                date: "2022-01-01T00:00:00.000Z",
            }
      }*/
    const {restaurantId, date} = req.body;
    const getMetricsByRestaurantAndDateRequest = new GetMetricsByRestaurantAndDateRequest().setRestaurantId(restaurantId).setDate(date);
    metricService.getMetricsByRestaurantAndDate(getMetricsByRestaurantAndDateRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.get('/api/metric/by-restaurant/:restaurantId', (req, res) => {
    const {restaurantId} = req.params;
    const getMetricsByRestaurantRequest = new GetMetricsByRestaurantRequest().setRestaurantId(restaurantId);
    metricService.getMetricsByRestaurant(getMetricsByRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.get('/api/metric/by-restaurant-group/:restaurantGroupId', (req, res) => {
    /* #swagger.parameters['restaurantGroupId'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }*/
    const {restaurantGroupId} = req.params;
    const getMetricsByRestaurantGroupRequest = new GetMetricsByRestaurantGroupRequest().setRestaurantGroupId(Number(restaurantGroupId));
    metricService.getMetricsByRestaurantGroup(getMetricsByRestaurantGroupRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.get('/api/metric/restaurant/:restaurantId', (req, res) => {
    const {restaurantId} = req.params;
    const getRestaurantRequest = new GetRestaurantRequest().setId(restaurantId);
    metricService.getRestaurant(getRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.get('/api/metric/restaurant-group/:restaurantGroupId', (req, res) => {
    /* #swagger.parameters['restaurantGroupId'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }*/
    const {restaurantGroupId} = req.params;
    const getRestaurantGroupRequest = new GetRestaurantGroupRequest().setId(Number(restaurantGroupId));
    metricService.getRestaurantGroup(getRestaurantGroupRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.post('/api/metric/restaurant', (req, res) => {
    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "example_name",
            "key": "example_key",
            "address": "example_address",
            "group_id": 1
        }
    } */
    const {name, key, address, groupId} = req.body;
    const createRestaurantRequest = new CreateRestaurantRequest()
        .setName(name)
        .setKey(key)
        .setAddress(address)
        .setGroupId(groupId);

    metricService.createRestaurant(createRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.post('/api/metric/restaurant-group', (req, res) => {
    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "example_name",
        }
    } */
    const {name} = req.body;
    const createRestaurantGroupRequest = new CreateRestaurantGroupRequest()
        .setName(name);

    metricService.createRestaurantGroup(createRestaurantGroupRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.put('/api/metric/restaurant/:restaurantId', (req, res) => {
    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "example_name",
            "key": "example_key",
            "address": "example_address",
            "group_id": 1
        }
    } */
    const {restaurantId} = req.params;
    const {name, key, address, groupId} = req.body;
    const updateRestaurantRequest = new UpdateRestaurantRequest().setId(restaurantId)
        .setName(name)
        .setKey(key)
        .setAddress(address)
        .setGroupId(groupId);


    metricService.updateRestaurant(updateRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.put('/api/metric/restaurant-group/:restaurantGroupId', (req, res) => {
    /* #swagger.parameters['restaurantGroupId'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }
     #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "name": "example_name",
        }
    } */
    const {restaurantGroupId} = req.params;
    const {name} = req.body;
    const updateRestaurantGroupRequest = new UpdateRestaurantGroupRequest().setId(Number(restaurantGroupId))
        .setName(name);

    metricService.updateRestaurantGroup(updateRestaurantGroupRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.delete('/api/metric/restaurant/:restaurantId', (req, res) => {
    const {restaurantId} = req.params;
    const deleteRestaurantRequest = new DeleteRestaurantRequest()
        .setId(restaurantId);

    metricService.deleteRestaurant(deleteRestaurantRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

metricRoutes.delete('/api/metric/restaurant-group/:restaurantGroupId', (req, res) => {
    /* #swagger.parameters['restaurantGroupId'] = {
           in: 'path',
           required: true,
           type: 'integer'
     }*/
    const {restaurantGroupId} = req.params;
    const deleteRestaurantGroupRequest = new DeleteRestaurantGroupRequest()
        .setId(Number(restaurantGroupId));

    metricService.deleteRestaurantGroup(deleteRestaurantGroupRequest, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});


metricRoutes.post('/api/metric', (req, res) => {
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                restaurantId: "restaurant_id:1",
                code: "income_1h",
                value: "99.99",
                key :"example_key"
            }
      }*/
    const {restaurantId, code, value, key} = req.body
    const newMetric = new Metric().setKey(key).setRestaurantId(restaurantId).setCode(code).setValue(value)

    metricService.pushMetric(newMetric, (error, response) => {
        if (error) {
            res.status(500).send({error: error.message});
        } else {
            res.json(response.toObject());
        }
    });
});

