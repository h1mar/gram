import { Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { prisma } from '../../db';
import { cloudinary, uploadFromBuffer } from '../../utils/cloudinary';
import multer from '../../utils/multer';

const router = Router();

router.get('/:skip', async (req, res) => {
	if (req.params.skip) {
		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				id: true,
				image: true,
				title: true,
				description: true,
				createdAt: true,
				User: {
					select: {
						image: true,
						username: true,
					},
				},
				Comment: {
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						text: true,
						id: true,
						User: {
							select: {
								username: true,
								image: true,
							},
						},
					},
					take: 2,
				},
			},
			skip: parseInt(req.params.skip),
			take: 2,
		});
		return res.json({ posts });
	}

	const posts = await prisma.post.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		select: {
			id: true,
			image: true,
			title: true,
			description: true,
			createdAt: true,
			User: {
				select: {
					image: true,
					username: true,
				},
			},
			Comment: {
				orderBy: {
					createdAt: 'desc',
				},
				select: {
					text: true,
					id: true,
					User: {
						select: {
							username: true,
							image: true,
						},
					},
				},
				take: 2,
			},
		},
		take: 2,
	});

	return res.json({ posts });
});

router.get('/one/:id', async (req, res) => {
	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	const post = await prisma.post.findUnique({
		where: {
			id: req.params.id,
		},
		select: {
			createdAt: true,
			description: true,
			image: true,
			id: true,
			title: true,
			Comment: {
				select: {
					text: true,
					id: true,
					User: {
						select: {
							username: true,
							image: true,
						},
					},
				},
			},
			userId: true,
			User: {
				select: {
					username: true,
					image: true,
				},
			},
		},
	});

	return res.json({ post });
});

router.delete('/:id', async (req, res) => {
	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	const post = await prisma.post.findUnique({
		where: {
			id: req.params.id,
		},
	});

	//@ts-ignore
	if (post?.userId !== req?.user?.id)
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });

	const deletePost = await prisma.post.delete({
		where: {
			id: req.params.id,
		},
	});

	return res.json({ status: 'success' });
});

router.get('/user/:id', async (req, res) => {
	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	const posts = await prisma.post.findMany({
		where: {
			//@ts-ignore
			userId: req.user.id,
		},
		take: 9,
	});

	return res.json({ posts });
});

router.post('/', multer.single('image'), async (req, res) => {
	if (req.isUnauthenticated())
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });

	const result: any = await uploadFromBuffer(req, 'memes');

	const post = await prisma.post.create({
		data: {
			description: req.body.description,
			title: req.body.title,
			image: result.secure_url,
			//@ts-ignore
			userId: req.user.id,
		},
	});

	return res.json({ post });
});

export default router;
