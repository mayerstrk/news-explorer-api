import { celebrate, Joi, Segments } from 'celebrate';

export const createUserValidator = celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

export const signInValidator = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
});

export const createArticleValidator = celebrate({
	[Segments.BODY]: Joi.object().keys({
		keyword: Joi.string().required(),
		title: Joi.string().required(),
		text: Joi.string().required(),
		date: Joi.date().iso().required(),
		source: Joi.string().required(),
		link: Joi.string().required(),
		image: Joi.string().required(),
	}),
});

export const deleteArticleValidator = celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		articleId: Joi.number().integer().required(),
	}),
});
