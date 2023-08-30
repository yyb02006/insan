/**
 * 파라미터로 여러 개의 문자열을 받아 각 문자열 사이에 공백을 추가하고 합쳐주는 함수
 */
export function cls(...className: string[]) {
	return className.join(' ');
}

/**
 * mainString의 문자열이나 배열이 searchString을 포함하고 있는지 normalize한 후 대, 소문자 구분없이 판단하는 함수
 */
export function ciIncludes(mainString: string, searchString: string) {
	return mainString
		.normalize('NFC')
		.toUpperCase()
		.includes(searchString.normalize('NFC').toUpperCase());
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

/**
 * write페이지에서 state들을 리셋시키는 함수지만 정작 쓰기엔 너무 길다.
 */
/* const resetStates = ({
		all = false,
		onSelectList = all,
		workInfos = all,
		page = all,
		searchWord = all,
		searchWordSnapshot = all,
		searchResults = all,
		searchResultsSnapshot = all,
	}: {
		onSelectList: boolean;
		workInfos: boolean;
		page: boolean;
		searchWord: boolean;
		searchWordSnapshot: boolean;
		searchResults: boolean;
		searchResultsSnapshot: boolean;
		all?: boolean;
	}) => {
		const resetProps = [
			{ condition: onSelectList, action: () => setOnSelectedList(false) },
			{ condition: workInfos, action: () => setWorkInfos([]) },
			{ condition: page, action: () => setPage(2) },
			{ condition: searchWord, action: () => setSearchWord('') },
			{
				condition: searchWordSnapshot,
				action: () => setSearchWordSnapshot(''),
			},
			{
				condition: searchResults,
				action: () =>
					setSearchResults((p) => ({
						...p,
						[category]: list[category],
					})),
			},
			{
				condition: searchResultsSnapshot,
				action: () =>
					setSearchResultsSnapshot((p) => ({ ...p, [category]: [] })),
			},
		];
		resetProps.forEach((prop) => {
			prop.condition && prop.action();
		});
	}; */
