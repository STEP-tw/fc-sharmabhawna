const fs = require("fs");

class StaticFiles {
	constructor() {
		this.files = {};
	}

	readFiles() {
		this.files["/"] = fs.readFileSync("./index.html", "utf8");
		this.files["/style.css"] = fs.readFileSync("./public/style.css", "utf8");
		this.files["/main.js"] = fs.readFileSync("./public/main.js", "utf8");
		this.files["/flowers.jpg"] = fs.readFileSync("./public/flowers.jpg");
		this.files["/abeliophyllum.html"] = fs.readFileSync(
			"./public/abeliophyllum.html",
			"utf8"
		);
		this.files["/ageratum.html"] = fs.readFileSync(
			"./public/ageratum.html",
			"utf8"
		);
		this.files["/watering_jar.gif"] = fs.readFileSync(
			"./public/watering_jar.gif"
		);
		this.files["/guest_book.html"] = fs.readFileSync(
			"./public//guest_book.html",
			"utf8"
		);
		this.files["/abeliophyllum.jpg"] = fs.readFileSync(
			"./public/abeliophyllum.jpg"
		);
		this.files["/documents/Abeliophyllum.pdf"] = fs.readFileSync(
			"./public/documents/Abeliophyllum.pdf"
		);
		this.files["/ageratum.jpg"] = fs.readFileSync("./public/ageratum.jpg");
		this.files["/documents/Ageratum.pdf"] = fs.readFileSync(
			"./public/documents/Ageratum.pdf"
		);
		this.files["/comment_form.html"] = fs.readFileSync(
			"./public/comment_form.html",
			"utf8"
		);
		this.files["/login_form.html"] = fs.readFileSync(
			"./public/login_form.html",
			"utf8"
		);
		this.files["/guestBook.js"] = fs.readFileSync(
			"./public/guestBook.js",
			"utf8"
		);
	}

	getContent(url) {
		return this.files[url];
	}
}

module.exports = StaticFiles;
