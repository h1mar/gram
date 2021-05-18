import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../../endpoints';
import { useAuth } from '../../hooks/useAuth';

export interface MeProps {}

const Me: React.FC<MeProps> = () => {
	const { user } = useAuth();
	const [post, setPost] = useState(null);
	const [showDelete, setShowDelete] = useState(false);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [skip, setSkip] = useState(0);
	const router = useRouter();

	useEffect((): any => {
		if (router.query.post) {
			const getUser = async () => {
				const res = await fetch(endpoints.onePost + router.query.post, {
					method: `GET`,
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
				})
					.then((res) => res.json())
					.then(async (json) => {
						setPost(json.post);

						await fetch(endpoints.comment + router.query.post, {
							method: `GET`,
							headers: { 'Content-Type': 'application/json' },
							credentials: 'include',
						})
							.then((res) => res.json())
							.then((json) => {
								setComments(json.comments);
								setSkip(5);
							})
							.catch(() => toast.error('Something went wrong'));
					})
					.catch(() => toast.error('Something went wrong'));
			};
			return getUser();
		}
	}, [router.query.post]);

	useEffect(() => {
		if (user && post && user.id === post.userId) {
			setShowDelete(true);
		}
	}, [user, post]);

	const deletePost = async () => {
		const res = await fetch(endpoints.post + post.id, {
			method: `DELETE`,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.error) return toast.error('Something went wrong');

				router.push('/me');
				return toast.success('Post deleted');
			})
			.catch(() => toast.error('Something went wrong'));
	};

	const postComment = async () => {
		const res = await fetch(endpoints.comment + post.id, {
			method: `POST`,
			body: JSON.stringify({
				text: comment,
			}),
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.error) return toast.error('Something went wrong');

				window.location.reload();
				return toast.success('Comment posted');
			})
			.catch(() => toast.error('Something went wrong'));
	};

	const fetchMoreComments = async () => {
		const res = await fetch(endpoints.post + post.id + '?skip=' + skip, {
			method: `GET`,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.comments) {
					setComments([...comments, ...json.comments]);
				}
			})
			.catch(() => toast.error('Something went wrong'));
	};

	return (
		<div className="w-full flex justify-center">
			<div className="w-11/12 md:w-7/12	lg:w-4/12 py-5">
				{post && (
					<div>
						<img src={post.image} alt="post" className="w-full rounded-t-md" />
						<div className="rounded-b-md bg-white p-5 ">
							<div className="flex justify-between mb-5">
								<div>
									<p>{post.createdAt}</p>

									<h1 className="text-3xl font-bold mb-1">{post.title}</h1>
									<p>{post.description}</p>
								</div>
								<div>
									<Link href={`/user/${post.User.username}`}>
										<a>
											<div>
												{post.User.image ? (
													<img
														src={post.User.image}
														alt={post.User.username}
														className="w-11 h-11 rounded-full"
													/>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="w-11 h-11 rounded-full text-gray-400"
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
												<h1>{post.User.username}</h1>
											</div>
										</a>
									</Link>
								</div>
							</div>
							{comments.length > 0 && (
								<>
									<hr />
									<h3 className="pt-2">Comments:</h3>
								</>
							)}
							{comments &&
								comments.map((c) => (
									<Link href={`/user/${c.User.username}`}>
										<a className="flex items-center my-2" key={c.id}>
											<img
												src={c.User.image}
												alt="profile picture"
												className="w-8 h-8 rounded-full"
											/>
											<p className="font-bold ml-1 mr-2">{c.User.username}: </p>
											<p>{c.text}</p>
										</a>
									</Link>
								))}
							<p
								onClick={fetchMoreComments}
								className="text-blue-500 underline cursor-pointer"
							>
								Load more comments
							</p>
							{user && (
								<textarea
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									placeholder="lorem ipsum dolor sit amet, consectetur adipiscing elit..."
									className="w-full mt-5 font-light p-2 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
								/>
							)}
							{comment.length > 0 && (
								<button
									type="button"
									className="w-full mt-1 mb-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 border border-transparent rounded-md hover:bg-yellow-200 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-20"
									onClick={postComment}
								>
									Post comment
								</button>
							)}
							{showDelete && (
								<p
									className="text-red-600 cursor-pointer w-auto"
									onClick={deletePost}
								>
									Delete
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Me;
