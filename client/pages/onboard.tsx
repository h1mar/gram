import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../endpoints';
import { useAuth } from '../hooks/useAuth';

export interface VerifyProps {
	user: object;
}

const Verify: React.FC<VerifyProps> = () => {
	const { user, setUser } = useAuth();
	const [username, setUsername] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState(null);
	const router = useRouter();

	const updateProfile = async () => {
		const formData = new FormData();

		formData.append('username', username);
		formData.append('description', description);
		if (image) formData.append('image', image);

		const res = await fetch(endpoints.update, {
			method: `POST`,
			body: formData,
			headers: { Accept: 'multipart/form-data' },
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.error) return toast.error(json.error);

				toast.success('Updated profile');
				setUser(json.user);
				router.push('/me');
			})
			.catch(() => toast.error('Something went wrong'));
	};

	useEffect(() => {
		if (user?.username) {
			router.push('/');
		} else if (user === null) {
			router.push('/');
		}
	}, [user]);

	return (
		<div className="w-full h-screen flex justify-center items-center">
			{!user && null}
			{user && (
				<div className="w-11/12 md:w-4/12	lg:w-2/12">
					<div className="w-full pb-5">
						<h1 className="text-4xl font-bold">Welcome</h1>
						<p className="text-sm font-light">Set up your profile</p>
					</div>
					<p className="text-md pb-1 font-light">Choose a unique username</p>
					<input
						type="text"
						placeholder="bob123"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full font-light p-5 mb-5 rounded-lg outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-20"
					/>
					<p className="text-md pb-1 font-light">Write a short bio</p>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="lorem ipsum dolor sit amet, consectetur adipiscing elit..."
						className="w-full mb-5 font-light p-2 rounded-lg outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-20"
					/>
					<p className="text-md pb-1 font-light">Upload a profile picture</p>
					<input
						type="file"
						placeholder="image"
						accept="image/*"
						onChange={(e: any) => setImage(e.target.files[0])}
						className="w-full font-light p-2 mb-5 rounded-lg outline-none ring-2 ring-white focus:ring-3 focus:ring-white"
					/>
					<button
						className="w-full p-5 bg-yellow-400 font-semibold hover:bg-opacity-80 focus:outline-none rounded-lg focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-20"
						onClick={updateProfile}
					>
						Save & Continue
					</button>
				</div>
			)}
		</div>
	);
};

export default Verify;
