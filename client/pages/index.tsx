import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../endpoints';

export default function Home() {
	const [posts, setPosts] = useState(null);
	const [skip, setSkip] = useState(0);
	const [fetching, setFetching] = useState(false);
	const [shouldFetchMore, setShouldFetchMore] = useState(true);

	useEffect((): any => {
		const getPosts = async () => {
			const res = await fetch(endpoints.post + skip.toString(), {
				method: `GET`,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			})
				.then((res) => res.json())
				.then((json) => {
					setPosts(json.posts);
					setSkip(skip + 2);
				})
				.catch((e) => {
					toast.error('Something went wrong');
					console.log(e);
				});
		};
		return getPosts();
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const handleScroll = () => {
		const windowHeight =
			'innerHeight' in window
				? window.innerHeight
				: document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		);
		const windowBottom = windowHeight + window.pageYOffset;
		if (windowBottom >= docHeight) {
			fetchMorePosts();
		}
	};

	const fetchMorePosts = async () => {
		if (shouldFetchMore) {
			setFetching(true);
			const res = await fetch(endpoints.post + skip.toString(), {
				method: `GET`,
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			})
				.then((res) => res.json())
				.then((json) => {
					console.log(json.posts);
					setPosts([...posts, ...json.posts]);
					setFetching(false);
					if (json.posts.length === 0) {
						setShouldFetchMore(false);
					}
				})
				.catch(() => toast.error('Something went wrong'));
			setSkip(skip + 2);
		}
	};

	return (
		<div className="w-full flex justify-center mb-96">
			<div className="w-11/12 md:w-7/12	lg:w-4/12 py-5">
				{posts &&
					posts.map((post) => (
						<div className="flex flex-col mb-24 w-full" key={post.id}>
							<Link href={`/post/${post.id}`}>
								<a className="cy-post">
									<img
										key={post.id}
										className="lg:meme-lg md:meme-md sm:meme object-cover w-full rounded-t-md"
										src={post.image}
										alt={post.title}
									/>
								</a>
							</Link>
							<div className="rounded-b-md bg-white p-5 ">
								<div className="flex justify-between mb-5">
									<div>
										<p>{post.createdAt}</p>
										<h1 className="text-3xl font-bold mb-1">{post.title}</h1>
										<p>{post.description}</p>
									</div>
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
														className="w-11 h-11 hover:opacity-80 text-gray-400"
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
								{post.Comment.length > 0 && (
									<>
										<hr />
										<h3 className="pt-2">Comments:</h3>
									</>
								)}
								{post.Comment &&
									post.Comment.map((c) => (
										<Link href={`/user/${c.User.username}`} key={c.id}>
											<a className="flex items-center my-2">
												<img
													src={c.User.image}
													alt="profile picture"
													className="w-8 h-8 rounded-full"
												/>
												<p className="font-bold ml-1 mr-2">
													{c.User.username}:{' '}
												</p>
												<p>{c.text}</p>
											</a>
										</Link>
									))}
							</div>
						</div>
					))}
				{fetching && <h1 className="text-center">Fetching posts...</h1>}
			</div>
		</div>
	);
}
