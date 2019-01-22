const blink = function() {
	const jar = document.getElementById("jar");
	jar.style.visibility = "hidden";
	setTimeout(() => (jar.style.visibility = "visible"), 1000);
};

const refreshComments = function() {
	fetch("/comments")
		.then(function(response) {
			return response.text();
		})
		.then(function(comments) {
			document.getElementById("comments_container").innerHTML = comments;
		});
};
