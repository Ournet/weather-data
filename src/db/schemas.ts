
import * as Joi from 'joi';

export const ReportSchema = Joi.object().keys({
    id: Joi.string().trim().min(2).max(50).required(),
    
    units: Joi.string().valid(['si']).required(),
    date: Joi.string().min(10).max(5000).required(),

    createdAt: Joi.date().required(),
    expiresAt: Joi.date().required(),
});

