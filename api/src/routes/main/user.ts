import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import { prisma } from '../../db';

const router = Router();

router.get('/:id', async (req, res) => {
	if (!req.params.id)
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Bad request' });

	const user = await prisma.user.findUnique({
		where: {
			username: req.params.id,
		},
		select: {
			username: true,
			image: true,
			description: true,
			createdAt: true,
			Post: {
				take: 9,
			},
		},
	});

	return res.json({ user });
});

export default router;
