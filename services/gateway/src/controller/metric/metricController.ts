import metricService from '../../services/clients/metric.client';
import express from "express";
import {GetMetricRequest, Metric} from "@gateway/proto/metric_pb";

export const metricController = (app: express.Application) => {
    app.get('/api/metric/:key', (req, res) => {
        const {key} = req.params;
        const metricInput = new GetMetricRequest().setKey(key);
        metricService.getMetric(metricInput, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });


    app.post('/api/metric', (req, res) => {
        const {restaurantId, code, value, key} = req.body
        const newMetric = new Metric().setKey(key).setRestaurantId(restaurantId).setCode(code).setValue(value)

        metricService.pushMetric(newMetric, (error, response) => {
            if (error) {
                res.json({error: error.message});
            } else {
                res.json(response.toObject());
            }
        });
    });
}

