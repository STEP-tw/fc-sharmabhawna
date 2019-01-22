const getComments = function() {
	fetch("/comments", { method: "GET" })
		.then(function(response) {
			return response.text();
		})
		.then(function(comments) {
			document.getElementById("comments_container").innerHTML = comments;
		});
};

const addComment = function() {
	let name = document.getElementById("name_holder").value;
	let comment = document.getElementById("comment_holder").value;
	let date = new Date();
	fetch("/comments", {
		method: "POST",
		body: JSON.stringify({ name, comment, date })
	}).then(response => {
		getComments();
	});
};

window.onload = getComments;
