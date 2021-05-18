import { SyncLoader } from 'react-spinners';
import { useAuth } from '../../hooks/useAuth';

export interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
	const { user } = useAuth();

	if (user === undefined) {
		return (
			<div className="w-full h-full fixed top-0 left-0 overflow-y-hidden z-50 bg-brand">
				<div className="flex w-full h-full justify-center items-center">
					<SyncLoader />
				</div>
			</div>
		);
	}

	return null;
};

export default Loader;
