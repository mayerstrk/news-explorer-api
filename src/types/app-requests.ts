export interface EmptyRequest {
	body: never;
	params: never;
}

export interface CreateUserRequest {
	body: {
		email: string;
		password: string;
		name: string;
	};
	params: never;
}

export interface SigninRequest {
	body: {
		email: string;
		password: string;
	};
	params: never;
}

export interface CreateArticleRequest {
	body: {
		keyword: string;
		title: string;
		text: string;
		date: string;
		source: string;
		link: string;
		image: string;
	};
	params: never;
}

export interface DeleteArticleRequest {
	body: never;
	params: {
		articleId: string;
	};
}

export type AppRequestVariant =
	| EmptyRequest
	| CreateUserRequest
	| SigninRequest
	| CreateArticleRequest
	| DeleteArticleRequest;
