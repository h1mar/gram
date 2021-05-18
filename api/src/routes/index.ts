import { Router } from 'express';
import post from './main/post';
import me from './main/me';
import user from './main/user';
import comment from './main/comment';

const router = Router();

router.use('/post', post);
router.use('/me', me);
router.use('/user', user);
router.use('/comment', comment);

export default router;
