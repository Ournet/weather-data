
import * as Joi from 'joi';

export const ReportSchema = Joi.object().keys({
    id: Joi.string().trim().min(2).max(50).required(),
    
    units: Joi.string().valid(['si']).required(),
    data: Joi.string().min(10).max(6000).required(),

    createdAt: Joi.date().required(),
    expiresAt: Joi.number().integer().required(),
});

