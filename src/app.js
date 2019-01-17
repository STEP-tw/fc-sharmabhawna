const { readFile } = require("fs");

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const getReqiuredFilePath = function(url) {
	if (url == "/") {
		return "./index.html";
	}
	return "." + url;
};

const app = (req, res) => {
	const reader = function(err, data) {
		if (err) {
			send(res, 404, "No such file found");
			return;
		}
		send(res, 200, data);
	};
	readFile(getReqiuredFilePath(req.url), reader);
};

// Export a function that can act as a handler

module.exports = app;
