const multer = require('multer');

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
	// function executed when multer tries to save a file
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error('Invalid MIME type');
		if (isValid) {
			error = null;
		}
		// path is relative to server.js file 
		cb(error, "backend/images");
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
		const extension = MIME_TYPE_MAP[file.mimetype];
		cb(null, name + '-' + Date.now() + '-' + extension);
	}
});

module.exports = multer({ storage: storage }).single("image");