const { readFile } = require("fs");

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

const app = (req, res) => {
	const reader = function(err, data) {
		if (err) {
			send(res, 404, "No such file found");
			return;
		}
		send(res, 200, data);
	};

	let filePath = getFilePath(req.url);
	readFile(filePath, reader);
};

// Export a function that can act as a handler

module.exports = app;
