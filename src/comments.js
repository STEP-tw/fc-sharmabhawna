const fs = require("fs");
const COMMENTS_FILE_PATH = "./src/comments_log.json";

class Comments {
	constructor() {
		this.commentsDetails = "";
	}

	readCommentsFile() {
		let commentsDetails = fs.readFileSync(COMMENTS_FILE_PATH, "utf8");
		this.commentsDetails = JSON.parse(commentsDetails);
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
