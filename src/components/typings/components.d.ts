import { OwnedVideoItems, WorkInfos } from '@/pages/work/write';
import { Dispatch, MutableRefObject, SetStateAction, SyntheticEvent } from 'react'; // import를 사용하는 순간 global에서 local로 변경

interface videoFeedItem {
  fetchLoading: boolean;
  workInfos: WorkInfos[] | undefined;
  intersectionRef: MutableRefObject<HTMLDivElement | null>;
  ownedVideos: OwnedVideoItems[];
  page: number;
  setWorkInfos: Dispatch<SetStateAction<WorkInfos[]>>;
  inputBlur: (e: SyntheticEvent<HTMLInputElement>) => void;
}

interface YoutubefeedProps extends videoFeedItem {
  resource: GapiItem[];
}

interface VimeofeedProps extends videoFeedItem {
  resource: VimeoVideos[];
}
