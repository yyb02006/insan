interface videoFeedItem {
  fetchLoading: boolean;
  workInfos: WorkInfos[] | undefined;
  intersectionRef: MutableRefObject<HTMLDivElement | null>;
  ownedVideos: OwnedVideoItems[];
  page: number;
  inputBlur: (e: SyntheticEvent<HTMLInputElement>) => void;
  inputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
}

interface YoutubefeedProps extends videoFeedItem {
  resource: GapiItem[];
}

interface VimeofeedProps extends videoFeedItem {
  resource: VimeoVideos[];
}
