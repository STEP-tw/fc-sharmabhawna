const isMatching = function(req, route) {
	if (route.method && req.method != route.method) {
		return false;
	}
	return true;
};

class Handler {
	constructor() {
		this.routes = [];
	}

	use(url) {
		this.routes.push({ handler: url });
	}

	get(url) {
		this.routes.push({ method: "GET", handler: url });
	}

	post(url, handler) {
		this.routes.push({ method: "POST", handler: handler });
	}

	handleRequest(req, res) {
		const matchingRoutes = this.routes.filter(route => isMatching(req, route));
		let remaining = [...matchingRoutes];

		const next = () => {
			let current = remaining[0];
			if (!current) {
				return;
			}
			remaining = remaining.slice(1);
			current.handler(req, res, next);
		};
		next();
	}
}

module.exports = Handler;
