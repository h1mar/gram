import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../../endpoints';
import { useAuth } from '../../hooks/useAuth';

export interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
	const { user, setUser } = useAuth();
	const [username, setUsername] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState();
	const router = useRouter();

	useEffect(() => {
		if (user === null) {
			router.push('/login');
		} else if (user) {
			setUsername(user.username);
			setDescription(user.description);
		}
	}, [user]);

	const save = async () => {
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

	if (!user) return null;

	return (
		<div className="w-full h-screen flex justify-center">
			<div className="w-11/12 md:w-7/12	lg:w-6/12 py-5">
				<h1 className="text-3xl font-bold mb-5">Settings</h1>
				<h3>Username:</h3>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Funny meme"
					className="font-light p-2 mb-5 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
				/>
				<h3>Description:</h3>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="lorem ipsum dolor sit amet, consectetur adipiscing elit..."
					className="mb-5 font-light p-2 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
				/>

				<h3>Profile picture:</h3>
				<input
					placeholder="Image"
					type="file"
					accept="image/*"
					onChange={(e: any) => setImage(e.target.files[0])}
					className="font-light p-2 mb-5 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
				/>
				<br />
				<button
					type="button"
					className="inline-flex justify-center px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 border border-transparent rounded-md hover:bg-yellow-200 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-20"
					onClick={save}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default Settings;
