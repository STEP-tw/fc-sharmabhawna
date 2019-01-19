const isMatching = function(req, route) {
	if (route.method && req.method != route.method) {
		return false;
	}
	if (route.method && req.url != route.url) {
		return false;
	}
	return true;
};

class Handler {
	constructor() {
		this.routes = [];
	}

	use(handler) {
		this.routes.push({ handler });
	}

	get(url, handler) {
		this.routes.push({ method: "GET", url, handler });
	}

	post(url, handler) {
		this.routes.push({ method: "POST", url, handler });
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
