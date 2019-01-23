const Handler = require("./requestHandler.js");
const app = new Handler();

const StaticFiles = require("./staticFiles.js");
const staticFiles = new StaticFiles();
staticFiles.readFiles();

const Comments = require("./comments.js");
let comments = new Comments();
comments.readCommentsFile();

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

const renderFileContent = function(req, res) {
	let content = staticFiles.getContent(req.url);
	if (content) {
		send(res, 200, content);
		return;
	}
	send(res, 404, "Not Found");
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

class GuestBook {
	constructor(url) {
		this.guestBook = staticFiles.getContent(url);
	}

	addCommentForm() {
		return this.guestBook.replace(
			"#FORM#",
			staticFiles.getContent("/comment_form.html")
		);
	}

	addLoginForm() {
		return this.guestBook.replace(
			"#FORM#",
			staticFiles.getContent("/login_form.html")
		);
	}

	guestBookWithCommentForm() {
		return this.addCommentForm(this.guestBook);
	}

	guestBookWithLoginForm() {
		return this.addLoginForm(this.guestBook);
	}
}

const renderGuestBook = function(req, res) {
	const cookie = req.headers["cookie"];
	req.cookie = cookie;
	const guestBook = new GuestBook(req.url);
	content = guestBook.guestBookWithLoginForm();
	if (req.cookie) {
		req.cookie = JSON.parse(cookie);
		let name = req.cookie.userName;
		content = guestBook.guestBookWithCommentForm();
		content = content.replace("#NAME#", name);
	}
	send(res, 200, content);
};

const renderModifiedGuestBook = function(req, res) {
	const guestBook = new GuestBook(req.url);
	let text = req.body;
	let { name } = readArgs(text);
	const cookie = req.headers["cookie"];
	req.cookie = cookie;
	let userID;
	if (!cookie) {
		userID = new Date().getTime();
		let user = JSON.stringify({ userName: name, userId: userID });
		res.setHeader("Set-Cookie", `${user}`);
	}
	let content = guestBook.guestBookWithCommentForm();
	content = content.replace("#NAME#", name);
	if (!name) {
		content = guestBook.guestBookWithLoginForm();
	}
	send(res, 200, content);
};

const provideComments = function(req, res) {
	send(res, 200, transformIntoHTML(comments.commentsDetails));
};

const updateComments = function(req, res) {
	let commentDetail = JSON.parse(req.body);
	comments.appendComment(commentDetail);
	send(res, 200, "ok");
};

app.use(readBody);
//app.use(logRequest);
app.get("/guest_book.html", renderGuestBook);
app.post("/guest_book.html", renderModifiedGuestBook);
app.get("/comments", provideComments);
app.post("/comments", updateComments);
app.use(renderFileContent);

module.exports = app.handleRequest.bind(app);
