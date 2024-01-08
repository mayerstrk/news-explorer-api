interface UserCredentials {
	email: string;
	passwordHash: string;
}

interface User extends UserCredentials {
	userName: string;
}

export type { UserCredentials, User };
