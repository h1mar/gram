import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import { prisma } from '../../db';

const router = Router();

router.get('/:id', async (req, res) => {
	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	if (req.query.skip) {
		const comments = await prisma.comment.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				postId: req.params.id,
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
			//@ts-ignore
			skip: parseInt(req.query.skip),
			take: 5,
		});

		return res.json({ comments });
	}

	const comments = await prisma.comment.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		where: {
			postId: req.params.id,
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
		take: 5,
	});

	return res.json({ comments });
});

router.post('/:id', async (req, res) => {
	if (req.isUnauthenticated())
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.send(ReasonPhrases.UNAUTHORIZED);

	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	const comment = await prisma.comment.create({
		data: {
			postId: req.params.id,
			text: req.body.text,
			//@ts-ignore
			userId: req.user.id,
		},
	});

	return res.json({ comment });
});

router.delete('/:id', async (req, res) => {
	if (req.isUnauthenticated())
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.send(ReasonPhrases.UNAUTHORIZED);

	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	const comment = await prisma.comment.findUnique({
		where: {
			id: req.params.id,
		},
	});

	//@ts-ignore
	if (comment?.userId !== req?.user?.id)
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.send(ReasonPhrases.UNAUTHORIZED);

	const deleteComment = await prisma.comment.delete({
		where: {
			id: req.params.id,
		},
	});

	return res.json({ status: 'success' });
});

export default router;
