const fs = require("fs");
const COMMENTS_FILE_PATH = "./src/comments_log.json";

class Comments {
	constructor() {
		this.commentsDetails = "";
	}

	readCommentsFile() {
		fs.readFile(COMMENTS_FILE_PATH, "utf8", (err, comments) => {
			this.commentsDetails = JSON.parse(comments);
		});
	}

	getComments() {
		return this.commentsDetails;
	}

	appendComment(comment) {
		this.commentsDetails.unshift(comment);
		fs.writeFile(
			COMMENTS_FILE_PATH,
			JSON.stringify(this.commentsDetails),
			err => {
				return;
			}
		);
	}
}

module.exports = Comments;
