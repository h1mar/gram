import c from 'cloudinary';
//@ts-ignore
import streamifier from 'streamifier';
export const cloudinary = c.v2;
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

export let uploadFromBuffer = (req: any, folder: string) => {
	return new Promise((resolve, reject) => {
		let cld_upload_stream = cloudinary.uploader.upload_stream(
			{
				folder: folder,
			},
			(error: any, result: any) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			}
		);

		streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
	});
};
