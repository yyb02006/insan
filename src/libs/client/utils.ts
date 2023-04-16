/**
 * 파라미터로 여러 개의 문자열을 받아 각 문자열 사이에 공백을 추가하고 합쳐주는 함수
 */
export function cls(...className: string[]) {
	return className.join(' ');
}
