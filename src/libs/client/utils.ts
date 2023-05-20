import { useState } from 'react';

/**
 * 파라미터로 여러 개의 문자열을 받아 각 문자열 사이에 공백을 추가하고 합쳐주는 함수
 */
export function cls(...className: string[]) {
	return className.join(' ');
}

export function fetchApi(url: string, opt?: { [key: string]: any }) {
	let result;
	fetch(url, opt)
		.then((response) => response.json())
		.then((data) => (result = data));
	console.log(result);
	return result;
}
