/**
 * 파라미터로 여러 개의 문자열을 받아 각 문자열 사이에 공백을 추가하고 합쳐주는 함수
 */
export function cls(...className: string[]) {
	return className.join(' ');
}

/**
 * fetch한 값을 콜백함수를 받아 처리해주는 함수
 */
export function fetchApi<T>(
	url: string,
	setFunc: (value: T) => void,
	opt?: { [key: string]: any }
) {
	fetch(url, opt)
		.then((res) => res.json())
		.then((data) => setFunc(data));
}

/**
 * YouTubeFetch를 처리해주는 함수
 */
export function fetchYouTubeApi<T>(
	method: 'playlists' | 'playlistItems',
	maxResult: string,
	setFunc: (value: T) => void,
	fields?: string,
	playlistId?: string
) {
	const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
	fetchApi(
		`https://www.googleapis.com/youtube/v3/${method}?key=${apiKey}&part=snippet&maxResults=${maxResult}${
			method === 'playlists' ? '&channelId=UCwy8JhA4eDumalKwKrvrxQA' : ''
		}${method === 'playlistItems' ? `&playlistId=${playlistId}` : ''}${
			fields ? `&fields=${fields}` : ''
		}`,
		setFunc
	);
}

/* const useYouTubeApi = <T>(
	method: string,
	maxResult: string,
	setFunc: (value: T) => void,
	fields?: string,
	playlistId?: string
) => {
	const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
	fetchApi(
		`https://www.googleapis.com/youtube/v3/${method}?key=${apiKey}&part=snippet&maxResults=${maxResult}${
			method === 'playlists' ? '&channelId=UCwy8JhA4eDumalKwKrvrxQA' : ''
		}${method === 'playlistItems' ? `&playlistId=${playlistId}` : ''}${
			fields ? `&fields=${fields}` : ''
		}`,
		setFunc
	);
}; */
