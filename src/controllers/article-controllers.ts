import controllerBuilder, {
	type ControllerHelper,
} from '../builders/controller-builder';
import { ErrorName } from '../utils/enums/error-names';
import pool from '../db';
import safe from '../utils/helpers/safe';
import { type QueryResult } from 'pg';
import { AppRequest } from '../types/request';
import assert from '../utils/helpers/assert';
import { type Response } from 'express';
import { ControllerHelperResponseData } from '../types/utility-types';

interface Article {
	article_id: number;
	keyword: string;
	title: string;
	content: string;
	date: Date;
	source: string;
	link: string;
	image: string;
	created_at: Date;
	updated_at: Date;
	owner: number;
}

// === Create article ===

const createArticleControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	const { keyword, title, content, date, source, link, image } = request.body;
	const { _id: userId } = assert(
		request.user,
		'No user property found in request object',
		ErrorName.internalServerError,
	);

	const {
		rows: [article],
	} = await safe({
		value: pool.query(
			'INSERT INTO protected.articles (keyword, title, content, date, source, link, image, owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[keyword, title, content, date, source, link, image, userId],
		),
		errorMessage: 'Error creating article',
		errorName: ErrorName.internalServerError,
	});

	return {
		request,
		response,
		data: article as Article,
	};
};

const createArticleController = controllerBuilder(
	createArticleControllerHelper,
);

// === Get current user articles ===

const getCurrentUserArticlesControllerHelper: ControllerHelper = async (
	request,
	response,
) => {
	const userId = await safe({
		value: request.user,
		errorMessage: 'No user arratched to request',
		errorName: ErrorName.internalServerError,
	});

	const { rows } = await safe<QueryResult<Article>>({
		value: pool.query(
			`
			SELECT a.* FROM articles a
			JOIN user_saved_articles usa ON a.article_id = usa.article_id
			WHERE uas.user_id = $1
		`,
			[userId],
		),
		errorMessage: 'Error getting artciles',
		errorName: ErrorName.internalServerError,
	});

	return {
		request,
		response,
		data: rows as Article[],
	};
};

const gerCurrentUserArticlesController = controllerBuilder(
	getCurrentUserArticlesControllerHelper,
);

// == Save article ==

const saveArticleControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	const { articleId } = request.params;
	const { _id: userId } = assert(
		request.user,
		'No user property found in request object',
		ErrorName.internalServerError,
	);

	await safe({
		value: pool.query(
			'INSERT INTO user_saved_articles (user_id, article_id) VALUES ($1, $2)',
			[userId, articleId],
		),
		errorMessage: 'Error saving article',
		errorName: ErrorName.internalServerError,
	});

	const {
		rows: [article],
	} = await safe({
		value: pool.query(
			'SELECT * FROM protected.articles WHERE article_id = $1',
			[articleId],
		),
		errorMessage: 'Error retrieving article',
		errorName: ErrorName.internalServerError,
	});

	return {
		request,
		response,
		data: article as Article,
	};
};

const saveArticleController = controllerBuilder(saveArticleControllerHelper);

// == Unsave article ==

const unsaveArticleControllerHelper = async (
	request: AppRequest,
	response: Response,
) => {
	const { articleId } = request.params;
	const { _id: userId } = assert(
		request.user,
		'No user property found in request object',
		ErrorName.internalServerError,
	);

	await safe({
		value: pool.query(
			'DELETE FROM user_saved_articles WHERE user_id = $1 AND article_id = $2',
			[userId, articleId],
		),
		errorMessage: 'Error unsaving article',
		errorName: ErrorName.internalServerError,
	});

	const {
		rows: [article],
	} = await safe({
		value: pool.query(
			'SELECT * FROM protected.articles WHERE article_id = $1',
			[articleId],
		),
		errorMessage: 'Error retrieving article',
		errorName: ErrorName.internalServerError,
	});

	return {
		request,
		response,
		data: article as Article,
	};
};

const unsaveArticleController = controllerBuilder(
	unsaveArticleControllerHelper,
);

export {
	createArticleController,
	gerCurrentUserArticlesController,
	saveArticleController,
	unsaveArticleController,
};

export type ArticleController =
	| typeof createArticleController
	| typeof gerCurrentUserArticlesController
	| typeof saveArticleController
	| typeof unsaveArticleController;

export type ArticleControllerHelper =
	| typeof createArticleControllerHelper
	| typeof getCurrentUserArticlesControllerHelper
	| typeof saveArticleControllerHelper
	| typeof unsaveArticleControllerHelper;

export type ArticleQueryResponse =
	ControllerHelperResponseData<ArticleControllerHelper>;
