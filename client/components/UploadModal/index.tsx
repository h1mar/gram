import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import endpoints from '../../endpoints';

export interface UploadModalProps {
	isOpen: boolean;
	closeModal: any;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, closeModal }) => {
	const [image, setImage] = useState();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const upload = async () => {
		setLoading(true);
		const formData = new FormData();
		formData.append('image', image);
		formData.append('title', title);
		formData.append('description', description);

		const res = await fetch(endpoints.post, {
			method: `POST`,
			body: formData,
			headers: { Accept: 'multipart/form-data' },
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.error) {
					setLoading(false);
					return toast.error(`Something went wrong`);
				}

				toast.success('Image posted');
				closeModal();
				router.push('/post/' + json.post.id);
			});
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 overflow-y-auto"
				onClose={closeModal}
			>
				<div className="min-h-screen backdrop-filter backdrop-blur-sm px-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className="inline-block h-screen align-middle"
						aria-hidden="true"
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
							<Dialog.Title
								as="h3"
								className="text-xl font-medium leading-6 mb-3"
							>
								Upload post
							</Dialog.Title>
							<div className="mt-2">
								{/* <p className="text-sm text-gray-500">
									Your payment has been successfully submitted. We’ve sent your
									an email with all of the details of your order.
								</p> */}
								<label className="text-sm mb-1">Title</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									disabled={loading}
									placeholder="lorem ipsum"
									className="w-full font-light p-2 mb-5 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
								/>
							</div>

							<div className="mt-2">
								<label className="text-sm mb-1">Description</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									disabled={loading}
									placeholder="lorem ipsum dolor sit amet, consectetur adipiscing elit..."
									className="w-full font-light p-2 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
								/>
							</div>

							<div className="mt-2">
								<label className="text-sm mb-1">Image</label>
								<input
									placeholder="Image"
									type="file"
									accept="image/*"
									onChange={(e: any) => setImage(e.target.files[0])}
									disabled={loading}
									className="w-full font-light p-2 mb-5 rounded-lg outline-none ring-2 ring-yellow-500 ring-opacity-20 focus:ring-3 focus:ring-yellow-500"
								/>
							</div>

							<div className="mt-4">
								<button
									type="button"
									disabled={loading}
									className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 border border-transparent rounded-md hover:bg-yellow-200 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-20"
									onClick={upload}
								>
									Upload
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};

export default UploadModal;
