const fs = require("fs");
const Handler = require("./requestHandler.js");
const app = new Handler();
const COMMENTS_FILE_PATH = "./src/comments_log.json";

class Data {
	constructor() {
		this.data = "";
	}

	insertData(chunk) {
		this.data = this.data + chunk;
	}

	appendData(chunk) {
		this.data + this.insertData(chunk);
	}
}

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const getFilePath = function(url) {
	if (url == "/") {
		return "./index.html";
	}
	return "./public" + url;
};

const readBody = function(req, res, next) {
	let data = new Data();
	req.on("data", data.appendData.bind(data));
	req.on("end", () => {
		req.body = data.data;
		next();
	});
};

const readArgs = function(text) {
	let keyValuePairs = text.split("&");
	return keyValuePairs.reduce((accumulator, keyValuePair) => {
		let keyAndValue = keyValuePair.split("=");
		let key = keyAndValue[0];
		let value = keyAndValue[1];
		accumulator[key] = value;
		return accumulator;
	}, {});
};

const logRequest = function(req, res, next) {
	console.log(req.method, req.url);
	console.log("headers =>", JSON.stringify(req.headers, null, 2));
	console.log("body =>", req.body);
	next();
};

const reader = function(res, err, content) {
	if (err) {
		send(res, 404, "Not found");
		return;
	}
	send(res, 200, content);
};

const readFileContent = function(filePath, res) {
	fs.readFile(filePath, reader.bind("null", res));
};

const renderFileContent = function(req, res) {
	let filePath = getFilePath(req.url);
	readFileContent(filePath, res);
};

const createCommentsTable = function(rows) {
	return `<table> <thead>
	<th>
			<tr>
				<td>DATETIME</td>
				<td>NAME</td>
				<td>COMMENTSLIST</td>
			</tr>
			</th>
		</thead> ${rows} </table>`;
};

const createCommentRow = function(commentDetail) {
	return `<tr> <td>${commentDetail.date}</td> <td>${
		commentDetail.name
	}</td> <td>${commentDetail.comment}</td> </tr>`;
};

const transformIntoHTML = function(commentsDetails) {
	let comments = commentsDetails.map(createCommentRow).join("");
	return createCommentsTable(comments);
};

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

let comments = new Comments();
comments.readCommentsFile();

const renderGuestBook = function(req, res) {
	let commentsDetails = comments.getComments();
	let filePath = getFilePath(req.url);
	fs.readFile(filePath, "utf8", (err, content) => {
		commentsDetails = transformIntoHTML(commentsDetails);
		content = content.replace("__COMMENTS__", commentsDetails);
		send(res, 200, content);
	});
};

const renderModifiedGuestBook = function(req, res) {
	let text = req.body;
	let args = readArgs(text);
	let { name, comment } = args;
	let date = new Date().toLocaleString();
	let commentDetail = { name, comment, date };
	comments.appendComment(commentDetail);
	renderGuestBook(req, res);
};

const updateGuestBook = function(req, res) {
	send(res, 200, transformIntoHTML(comments.commentsDetails));
};

app.use(readBody);
app.use(logRequest);
app.get("/guest_book.html", renderGuestBook);
app.post("/guest_book.html", renderModifiedGuestBook);
app.get("/comments", updateGuestBook);
app.use(renderFileContent);

module.exports = app.handleRequest.bind(app);
