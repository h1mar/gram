import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Router } from 'express';
import { prisma } from '../../db';
import multer from '../../utils/multer';
import { uploadFromBuffer } from '../../utils/cloudinary';

const router = Router();

router.get('/', async (req, res) => {
	if (req.isUnauthenticated()) return res.json({ error: 'Unathorized' });

	return res.json(req.user);
});

router.post('/update', multer.single('image'), async (req, res) => {
	if (req.isUnauthenticated())
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });

	if (req.file) {
		const result: any = await uploadFromBuffer(req, 'profile_pictures');

		const user = await prisma.user.update({
			where: {
				//@ts-ignore
				id: req.user.id,
			},
			data: {
				username: req.body.username,
				image: result.secure_url,
				description: req.body.description,
			},
		});

		return res.json({ user });
	} else {
		const user = await prisma.user.update({
			where: {
				//@ts-ignore
				id: req.user.id,
			},
			data: {
				username: req.body.username,
				description: req.body.description,
			},
		});

		return res.json({ user });
	}
});

router.post('/logout', async (req, res) => {
	if (req.isUnauthenticated())
		return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });

	req.logOut();

	return res.status(StatusCodes.OK).json({ status: 'success' });
});

export default router;
