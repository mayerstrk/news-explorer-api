export interface SignupRequest {
	body: {
		email: string;
		password: string;
		name: string;
	};
}

export interface SigninRequest {
	body: {
		email: string;
		password: string;
	};
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
}

export interface DeleteArticleRequest {
	params: {
		articleId: number;
	};
}

export interface SaveArticleRequest {
	params: {
		articleId: number;
	};
}

export interface UnsaveArticleRequest {
	params: {
		articleId: number;
	};
}
