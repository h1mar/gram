import { prisma } from '.';

export async function getOrCreateUserWithEmail(
	destination: string
): Promise<any> {
	try {
		if (!destination) return Error('invalid email');

		const existingUser = await prisma.user.findUnique({
			where: {
				email: destination,
			},
		});
		if (existingUser) return existingUser;

		const newUser = await prisma.user.create({
			data: {
				email: destination,
			},
		});
		return newUser;
	} catch (err) {
		return err;
	}
}

export async function getUserById(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		if (user) return user;

		return null;
	} catch (err) {
		return err;
	}
}
