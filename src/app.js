const fs = require("fs");
const Handler = require("./requestHandler.js");
const app = new Handler();

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
		req.body = data;
		next();
	});
};

const logRequest = function(req, res, next) {
	console.log(req.method, req.url);
	console.log("headers =>", JSON.stringify(req.headers, null, 2));
	console.log("body =>", req.body);
	next();
};

const reader = function(res, err, content) {
	if (err) {
		send(res, 404, "No such file found");
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

app.use(readBody);
app.use(logRequest);
app.get(renderFileContent);

module.exports = app.handleRequest.bind(app);
