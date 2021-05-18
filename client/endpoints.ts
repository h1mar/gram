const apiDomain = 'https://gramapi.himar.dev';

export default {
	login:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/auth/magiclogin/'
			: apiDomain + '/auth/magiclogin/',
	update:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/me/update/'
			: apiDomain + '/me/update/',
	post:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/post/'
			: apiDomain + '/post/',
	callback:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/auth/magiclogin/callback?token='
			: apiDomain + '/auth/magiclogin/callback?token=',
	comment:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/comment/'
			: apiDomain + '/comment/',
	user:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/user/'
			: apiDomain + '/user/',
	logout:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/me/logout'
			: apiDomain + '/me/logout/',
	me:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/me/'
			: apiDomain + '/me/',
	onePost:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/post/one/'
			: apiDomain + '/post/one/',
};
