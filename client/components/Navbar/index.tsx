import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import UploadModal from '../UploadModal';

export interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const { user, logout } = useAuth();
	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	return (
		<div className="w-full">
			<div className="w-11/12 md:w-7/12	lg:w-6/12 py-5	m-auto flex justify-between align-baseline">
				<Link href="/">
					<a className="font-bold text-4xl cy-gram">gram</a>
				</Link>
				{user && (
					<div className="flex">
						<button
							onClick={() => setIsOpen(true)}
							className="mr-4 bg-white rounded-lg p-1 w-11 h-11 flex items-center justify-center focus:outline-none hover:bg-opacity-80 focus:ring-4 focus:ring-gray-200"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg>
						</button>

						<button
							onClick={() => logout()}
							className="mr-4 bg-white rounded-lg py-1 px-2 flex items-center justify-center focus:outline-none hover:bg-opacity-80 focus:ring-4 focus:ring-gray-200"
						>
							Logout
						</button>

						{isOpen && (
							<UploadModal
								isOpen={isOpen}
								closeModal={() => setIsOpen(false)}
							/>
						)}

						{user.image ? (
							<Link href="/me">
								<a>
									<img
										src={user.image}
										alt="profile picture"
										className="w-11 h-11 rounded-full hover:opacity-80"
									/>
								</a>
							</Link>
						) : (
							<Link href="/me">
								<a>
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
								</a>
							</Link>
						)}
					</div>
				)}

				{user === null && (
					<button
						onClick={() => router.push('/login')}
						className="cy-login bg-white rounded-lg py-1 px-2 flex items-center justify-center focus:outline-none hover:bg-opacity-80 focus:ring-4 focus:ring-gray-200"
					>
						Login
					</button>
				)}
			</div>
		</div>
	);
};

export default Navbar;
