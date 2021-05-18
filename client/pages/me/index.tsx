import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../../endpoints';
import { useAuth } from '../../hooks/useAuth';

export interface MeProps {}

const Me: React.FC<MeProps> = () => {
	const { user } = useAuth();
	const router = useRouter();
	const [posts, setPosts] = useState(null);

	useEffect((): any => {
		const getUser = async () => {
			if (user === null) {
				router.push('/login');
			}
			if (user) {
				const res = await fetch(endpoints.post + `user/${user.id}`, {
					method: `GET`,
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				})
					.then((res) => res.json())
					.then((json) => {
						setPosts(json.posts);
					})
					.catch(() => toast.error('Something went wrong'));
			}
		};
		return getUser();
	}, [user]);

	return (
		<div className="w-full flex justify-center">
			<div className="w-11/12 md:w-7/12	lg:w-6/12 py-5">
				{user && (
					<div className="w-full flex flex-col items-center mb-10">
						{user.image ? (
							<img
								src={user.image}
								className="rounded-full w-52 h-52 mb-3"
								alt="profile picture"
							/>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-52 h-52 mb-3 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						)}
						<h1 className="text-3xl font-bold w-auto">{user.username}</h1>
						{/* <input
								value={user.username}
								className="text-3xl font-bold w-auto"
							/> */}
						<p>{user.description}</p>
						<Link href="/me/settings">
							<a className="text-blue-500 underline">Settings</a>
						</Link>
					</div>
				)}
				{posts && (
					<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4">
						{posts.map((post) => (
							<div className="flex flex-col" key={post.id}>
								<Link href={`/post/${post.id}`}>
									<a>
										<img
											src={post.image}
											alt="post"
											className="h-72 w-full object-cover hover:opacity-80"
										/>
									</a>
								</Link>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);

	return <h1>Loading</h1>;
};

export default Me;
