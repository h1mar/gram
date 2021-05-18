import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../endpoints';
import { useAuth } from '../hooks/useAuth';

export interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	const { user } = useAuth();
	const [email, setEmail] = useState('');
	const [verificationCode, setVerificationCode] = useState(null);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push('/');
		}
	}, [user]);

	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const handleSubmit = () => {
		if (re.test(email)) {
			// POST a request with the users email or phone number to the server
			fetch(endpoints.login, {
				method: `POST`,
				body: JSON.stringify({
					destination: email,
				}),
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						return setVerificationCode(json.code);
					} else return toast.error('Something went wrong');
				})
				.catch(() => toast.error('Something went wrong'));
		} else {
			toast.error('Invalid email.');
		}
	};

	if (user) return null;

	return (
		<div className="w-full h-screen flex justify-center items-center">
			{!verificationCode && (
				<div className="w-11/12 md:w-4/12	lg:w-2/12">
					<div className="w-full pb-5">
						<h1 className="text-4xl font-bold">Login</h1>
						<p className="text-sm font-light">Login and signup here</p>
					</div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="hello@email.com"
						className="w-full font-light p-5 mb-5 rounded-lg outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-20"
					/>
					<button
						className="w-full p-5 bg-yellow-400 font-semibold hover:bg-opacity-80 focus:outline-none rounded-lg focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-20"
						onClick={handleSubmit}
					>
						Login
					</button>
				</div>
			)}
			{verificationCode && (
				<div className="w-11/12 md:w-4/12	lg:w-2/12 text-center">
					<div className="w-full pb-2">
						<h1 className="text-4xl font-bold">Check your email</h1>
					</div>

					<div className="pb-2">
						<p className="text-md font-light">
							We sent you a magic link to {email}
						</p>
						<p className="text-md font-light">
							Click on it to confirm the login.
						</p>
					</div>
					<p className="text-sm font-light text-gray-500">
						Verification code: {verificationCode}
					</p>
				</div>
			)}
		</div>
	);
};

export default Login;
