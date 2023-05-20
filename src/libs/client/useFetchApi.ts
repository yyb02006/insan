export default function fetchApi<T>(
	url: string,
	setFunc: (value: T) => void,
	opt?: { [key: string]: any }
) {
	fetch(url, opt)
		.then((response) => response.json())
		.then((data) => setFunc(data));
}
