import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../endpoints';
import { useAuth } from '../hooks/useAuth';

export interface VerifyProps {}

const Verify: React.FC<VerifyProps> = () => {
	const { setUser } = useAuth();
	const router = useRouter();

	useEffect((): any => {
		if (router.query.token) {
			const verify = async () => {
				const token = router.query.token;
				// console.log(token);
				const res = await fetch(endpoints.callback + token, {
					method: `GET`,
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				})
					.then((res) => res.json())
					.then((json): any => {
						if (json.user) {
							setUser(json.user);
							toast.success('Logged in');
							if (!json.user.username) {
								return router.push('/onboard');
							} else router.push('/');
						} else {
							toast.error('Something went wrong');
						}
					})
					.catch(() => toast.error('Something went wrong'));
			};

			return verify();
		}
	}, [router.query.token]);

	return null;
};

export default Verify;
