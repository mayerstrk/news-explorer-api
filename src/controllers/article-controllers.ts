import controllerBuilder from '../builders/controller-builder';
import { ErrorName } from '../utils/enums/error-names';
import pool from '../database';
import safe from '../utils/helpers/safe';
import { AppRequest } from '../types/request';
import assert from '../utils/helpers/assert';
import assertWithTypeguard from '../utils/helpers/assert-with-typeguard';
import { type Response } from 'express';
import { ControllerHelperResponseData } from '../types/utility-types';
import {
	CreateArticleRequest,
	DeleteArticleRequest,
	EmptyRequest,
} from '../types/app-requests';

interface Article {
	article_id: number;
	keyword: string;
	title: string;
	text: string;
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
	request: AppRequest<CreateArticleRequest>,
	response: Response,
) => {
	const { keyword, title, text, date, source, link, image } = request.body;
	const { _id: userId } = assert(
		request.user,
		'No user property found in request object',
		ErrorName.internalServerError,
	);

	const {
		rows: [article],
	} = await safe(
		pool.query<Article>(
			'INSERT INTO protected.articles (keyword, title, text, date, source, link, image, owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[keyword, title, text, date, source, link, image, userId],
		),
		'Error creating article',
		ErrorName.internalServerError,
	);

	return {
		request,
		response,
		data: article,
	};
};

const createArticleController = controllerBuilder(
	createArticleControllerHelper,
);

// === Delete article ===

const deleteArticleControllerHelper = async (
	request: AppRequest<DeleteArticleRequest>,
	response: Response,
) => {
	const articleId = assertWithTypeguard(
		Number.parseInt(request.params.articleId),
		(v): v is number => Number.isInteger(v),
		'Failed to parse article id',
		ErrorName.internalServerError,
	);

	const { _id: userId } = assert(
		request.user,
		'No user property found in request object',
		ErrorName.internalServerError,
	);

	const {
		rows: [{ owner }],
		rowCount,
	} = await safe(
		pool.query<Pick<Article, 'owner'>>(
			'SELECT owner FROM protected.articles WHERE article_id = $1',
			[articleId],
		),
		'Error executing get owner query',
		ErrorName.internalServerError,
	);

	assert(rowCount, 'Article not found', ErrorName.internalServerError);

	assert(
		owner === userId,
		'Article has a different owner',
		ErrorName.forbidden,
	);

	const {
		rows: [article],
	} = await safe(
		pool.query<Article>(
			'DELETE FROM protected.articles WHERE article_id = $1 AND owner = $2 RETURNING *',
			[articleId, userId],
		),
		'Error deleting article',
		ErrorName.internalServerError,
	);

	return {
		request,
		response,
		data: article,
	};
};

const deleteArticleController = controllerBuilder(
	deleteArticleControllerHelper,
);

// === Get owned articles ===

const getAllArticlesControllerHelper = async (
	request: AppRequest<EmptyRequest>,
	response: Response,
) => {
	const { _id: userId } = assert(
		request.user,
		'No user property found in request object',
		ErrorName.internalServerError,
	);

	const { rows: articles } = await safe(
		pool.query<Article>('SELECT * FROM protected.articles WHERE owner = $1', [
			userId,
		]),
		'Error executing get articles query',
		ErrorName.internalServerError,
	);

	return {
		request,
		response,
		data: getArticlesQueryResult.rows,
	};
};

const getAllArticlesController = controllerBuilder(
	getAllArticlesControllerHelper,
);

export {
	createArticleController,
	deleteArticleController,
	getAllArticlesController,
};

export type ArticleController =
	| typeof createArticleController
	| typeof deleteArticleController
	| typeof getAllArticlesController;

export type ArticleControllerHelper =
	| typeof createArticleControllerHelper
	| typeof deleteArticleControllerHelper
	| typeof getAllArticlesControllerHelper;

export type ArticleQueryResponse =
	ControllerHelperResponseData<ArticleControllerHelper>;
