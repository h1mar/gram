import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../components/Auth/Provider';
import Loader from '../components/Loader';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const routesWithNoNavbar = ['/login', '/signup', '/onboard'];
	return (
		<AuthProvider>
			{!routesWithNoNavbar.includes(router.pathname) && <Navbar />}
			<Toaster />
			<Loader />
			<Component {...pageProps} />
		</AuthProvider>
	);
}

export default MyApp;
