export default class Utils {
	static queryParamsToObj = query => {
		if (!query) return {};
		query = /^[?#]/.test(query) ? query.slice(1) : query;
		return query.split("&").reduce((params, param) => {
			let [key, value] = param.split("=");
			params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
			return params;
		}, {});
	};
}
