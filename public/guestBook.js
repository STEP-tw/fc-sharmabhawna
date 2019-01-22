const refreshComments = function() {
	fetch("/comments", { method: "GET" })
		.then(function(response) {
			return response.text();
		})
		.then(function(comments) {
			document.getElementById("comments_container").innerHTML = comments;
		});
};

window.onload = refreshComments;
