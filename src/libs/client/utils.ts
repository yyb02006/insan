/**
 * 파라미터로 여러 개의 문자열을 받아 각 문자열 사이에 공백을 추가하고 합쳐주는 함수
 */
export function cls(...className: string[]) {
	return className.join(' ');
}

/**
 * 기본 fetch 함수
 */
interface Init {
	method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
	headers?: { [key: string]: any };
	[key: string]: any;
}

export async function fetchData(url: string, init?: Init) {
	const response = await (await fetch(url, init)).json();
	return response;
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
	method: 'playlists' | 'playlistItems' | 'videos',
	maxResult: string,
	setFunc: (value: T) => void,
	fields?: string,
	playlistId?: string,
	videosId?: string,
	nextPageToken?: string
) {
	const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
	fetchApi(
		`https://www.googleapis.com/youtube/v3/${method}?${
			method === 'videos' ? `id=${videosId}&` : ''
		}key=${apiKey}&part=snippet&maxResults=${maxResult}${
			method === 'playlists' ? '&channelId=UCwy8JhA4eDumalKwKrvrxQA' : ''
		}${method === 'playlistItems' ? `&playlistId=${playlistId}` : ''}${
			fields ? `&fields=${fields}` : ''
		}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`,
		setFunc
	);
}

/**
 * mainString의 문자열이 searchString을 포함하고 있는지 대, 소문자 구분없이 판단하는 함수
 */
export function ciIncludes(mainString: string, searchString: string) {
	return mainString.toUpperCase().includes(searchString.toUpperCase());
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

/* 	const filterResults = ({
		category,
		list,
		searchWord,
		ciIncludes,
	}: {
		category: FlatformsCategory;
		list: VimeoVideos[] | GapiItem[];
		searchWord: string;
		ciIncludes: (mainString: string, searchString: string) => boolean;
	}) => {
		if (category === 'filmShort') {
			return (list as VimeoVideos[]).filter(
				(el) =>
					ciIncludes(el.name, searchWord) ||
					ciIncludes(el.resource_key, searchWord)
			);
		} else if (category === 'outsource') {
			return (list as GapiItem[]).filter(
				(el) =>
					ciIncludes(el.snippet.title, searchWord) ||
					ciIncludes(el.snippet.resourceId?.videoId || '', searchWord)
			);
		}
		return [];
	}; */
