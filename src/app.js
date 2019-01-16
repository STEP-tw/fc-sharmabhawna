const { readFile } = require("fs");

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const app = (req, res) => {
	if (req.url == "/") {
		readFile("./index.html", (err, data) => {
			if (err) {
				send(res, 404, "No such file found");
				return;
			}
			send(res, 200, data);
		});
	}
	if (req.url == "/style.css") {
		readFile("./style.css", (err, data) => {
			if (err) {
				send(res, 404, "No such file found");
				return;
			}
			send(res, 200, data);
		});
	}
	if (req.url == "/watering_jar.gif") {
		readFile("./watering_jar.gif", (err, data) => {
			if (err) {
				send(res, 404, "No such file found");
				return;
			}
			send(res, 200, data);
		});
	}
	if (req.url == "/flowers.jpg") {
		readFile("./flowers.jpg", (err, data) => {
			if (err) {
				send(res, 404, "No such file found");
				return;
			}
			send(res, 200, data);
		});
	}
};

// Export a function that can act as a handler

module.exports = app;
