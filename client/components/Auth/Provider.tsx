import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../../endpoints';
import AuthContext from './Context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState(undefined);
	const router = useRouter();

	const logout = async () => {
		const res = await fetch(endpoints.logout, {
			method: `POST`,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((json) => {
				router.push('/');
				setUser(null);
			});
	};

	useEffect((): any => {
		const getUser = async () => {
			const res = await fetch(endpoints.me, {
				method: `GET`,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.error) {
						setUser(null);
					} else setUser(json);
				})
				.catch((e) => {
					toast.error('Something went wrong');
					console.log(e);
				});
		};

		return getUser();
	}, []);

	return (
		<AuthContext.Provider value={{ user, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}
