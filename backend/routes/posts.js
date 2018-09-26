const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

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

router.post(
	'', 
	checkAuth,
	multer({ storage: storage }).single("image"), 
	(req, res, next) => {

		// url of our server
		const url = req.protocol + '://' + req.get('host');

		// body property added by bodyParser middleware (added in app.js)
		const post = new Post({
			title: req.body.title,
			content: req.body.content,
			imagePath: url + '/images/' + req.file.filename
		});
		post.save().then(createdPost => {
			res.status(201).json({
				message: 'Post added successfully',
				post: {
					...createdPost,
					id: createdPost._id
				}

			});
		})
	}
);

router.put(
	'/:id',
	checkAuth,
	multer({ storage: storage }).single("image"), 
	(req, res, next) => {
		let imagePath = req.body.imagePath;
		if (req.file) {
			const url = req.protocol + '://' + req.get('host');
			imagePath = url + '/images/' + req.file.filename;
		}
		const post = new Post({
			_id: req.body.id,
			title: req.body.title,
			content: req.body.content,
			imagePath: imagePath
		});
		Post.updateOne({ _id: req.params.id }, post).then(result => {
			console.log(result);
			res.status(200).json({ message: "Update Sucessful!" });
		});
	}
);



router.get(
	'',
	(req, res, next) => {
		
		// + in front to convert to num
		const pageSize = +req.query.pageSize;
		const currentPage = +req.query.currentPage;

		//find does not execute the query yet (need to call then())
		const postQuery = Post.find();
		let fetchedPosts;

		// If params not in request
		if (pageSize && currentPage) {
			postQuery
				.skip(pageSize * (currentPage - 1))  //skips the first n elements  
				.limit(pageSize);
		}

		postQuery
			.then(documents => {
				fetchedPosts = documents;
				return Post.count();
			})
			.then(count => {
				res.status(200).json({
					message: 'Posts fetched successfully',
					posts: fetchedPosts,
					maxPosts: count
				});
			});
	}
);



router.get('/:id', (req, res, next) => {
	Post.findById(req.params.id).then((post) => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({ message: 'Post not found' });
		}
	});
});

router.delete("/:id", checkAuth, (req, res, next) => {
	Post.deleteOne({ _id: req.params.id }).then(result => {
		console.log(result);
		res.status(200).json({ message: "Post deleted!" });
	});
});


module.exports = router;