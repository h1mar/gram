import React from 'react';

interface IUser {
	id: string;
	username: string | null;
	email: string;
	description: string | null;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
}

const AuthContext = React.createContext<{
	user: IUser | undefined | null;
	logout: () => void;
	setUser: Function;
}>({
	user: undefined,
	logout: async () => null,
	setUser: () => null,
});

export default AuthContext;
