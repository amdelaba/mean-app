const Post = require('../models/post');

exports.getPosts = 	(req, res, next) => {
		
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
    })
    .catch( error => {
      res.status(500).json({ message: "Fetching posts failed" });
    });
};


exports.getOnePost = (req, res, next) => {
	Post.findById(req.params.id).then((post) => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({ message: 'Post not found' });
		}
	}).catch( error => {
		res.status(500).json({ message: "Retrieving post failed" });
	});
};


exports.createPost = 	(req, res, next) => {
  // url of our server
  const url = req.protocol + '://' + req.get('host');

  // body property added by bodyParser middleware (added in app.js)
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
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
  .catch( error => {
    res.status(500).json({ message: "Creating a post failed" });
  });
};


exports.updatePost = 	(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Update Sucessful!" });
      } else {
        res.status(401).json({ message: "Update NOT Successful. Not Authorized" });
      }
  })
  .catch( error => {
    res.status(500).json({ message: "Updating post failed" });
  });
};


exports.deletePost = (req, res, next) => {
	Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then( result => {
		// console.log(result);
		// result.nModified not present in the json with deletion
		if (result.n > 0) {
			res.status(200).json({ message: "Deletion Successfull" });
		} else {
			res.status(401).json({ message: "Deletion NOT Successful. Not Authorized" });
		}
	})
	.catch( error => {
		res.status(500).json({ message: "Deleting post failed" });
	});
};