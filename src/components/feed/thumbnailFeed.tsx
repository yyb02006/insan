import Image from 'next/image';
import Circles from '@/components/circles';
import Input from '@/components/input';
import { VimeofeedProps, YoutubefeedProps } from '@/components/typings/components';
import { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import { cls } from '@/libs/client/utils';
import { OwnedVideoItems, WorkInfos } from '@/pages/work/work';

export const createInputChange = (
  setWorkInfos: Dispatch<SetStateAction<WorkInfos[]>>,
  workInfos: WorkInfos[] | undefined
) => {
  return (e?: SyntheticEvent<HTMLInputElement>) => {
    if (e === undefined) return;
    const { value, name, dataset, type } = e.currentTarget;
    const workIdx = workInfos?.findIndex((i) => i.resourceId === dataset.resourceid);
    if (workIdx !== undefined && workIdx >= 0) {
      if (name === 'title') {
        setWorkInfos((p) =>
          p.map((arr) => (arr.resourceId === dataset.resourceid ? { ...arr, title: value } : arr))
        );
      } else if (name === 'description') {
        setWorkInfos((p) =>
          p.map((arr) =>
            arr.resourceId === dataset.resourceid ? { ...arr, description: value } : arr
          )
        );
      } else if (name === 'date') {
        setWorkInfos((p) =>
          p.map((arr) => (arr.resourceId === dataset.resourceid ? { ...arr, date: value } : arr))
        );
      } else if (type === 'radio') {
        setWorkInfos((p) =>
          p.map((arr) =>
            arr.resourceId === dataset.resourceid ? { ...arr, category: value } : arr
          )
        );
      }
    } else {
      if (name === 'title') {
        setWorkInfos((p) => [
          ...p,
          {
            title: value,
            description: dataset.description || '',
            date: dataset.date || '',
            category: dataset.category || '',
            resourceId: dataset.resourceid || '',
            thumbnailLink: dataset.thumbnail || '',
            animatedThumbnailLink: dataset.animated_thumbnail || '',
            order: Number(dataset.order) || 0,
          },
        ]);
      }
    }
  };
};

export const onListItemClick = ({
  matchedWorkInfo,
  matchedOwnedVideo,
  currentVideoDetails,
  setWorkInfos,
  category,
}: {
  matchedWorkInfo?: WorkInfos;
  matchedOwnedVideo?: OwnedVideoItems;
  currentVideoDetails?: {
    resourceId?: string;
    thumbnailLink?: string;
    animatedThumbnailLink?: string;
  };
  setWorkInfos: Dispatch<SetStateAction<WorkInfos[]>>;
  category?: string;
}) => {
  if (matchedWorkInfo) {
    setWorkInfos((prev) =>
      prev.filter(({ resourceId }) => resourceId !== matchedWorkInfo.resourceId)
    );
  } else {
    setWorkInfos((prev) => [
      ...prev,
      {
        title: matchedOwnedVideo?.title || '',
        description: matchedOwnedVideo?.description || '',
        date: matchedOwnedVideo?.date || '',
        category: category || '',
        resourceId: currentVideoDetails?.resourceId || '',
        thumbnailLink: currentVideoDetails?.thumbnailLink || '',
        animatedThumbnailLink: currentVideoDetails?.animatedThumbnailLink || '',
        order: matchedOwnedVideo?.order || 0,
      },
    ]);
  }
};

export function VimeoThumbnailFeed({
  resource,
  workInfos,
  intersectionRef,
  fetchLoading,
  ownedVideos,
  page,
  setWorkInfos,
  inputBlur,
}: VimeofeedProps) {
  const inputChange = createInputChange(setWorkInfos, workInfos);
  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
        {resource.map(
          (
            { animated_thumbnail, name, pictures: { base_link }, player_embed_url, resource_key },
            idx
          ) => {
            const matchedWorkInfo: WorkInfos | undefined = workInfos?.find(
              (workInfo) => workInfo.resourceId === player_embed_url
            );
            const matchedOwnedVideo: OwnedVideoItems | undefined = ownedVideos.find(
              (ownedVideo) => ownedVideo.resourceId === player_embed_url
            );
            return idx < 12 * (page - 1) ? (
              <li
                key={idx} /* resource_key */
                className={`w-full flex flex-col justify-between ${
                  matchedWorkInfo
                    ? 'ring-2 ring-palettered'
                    : matchedOwnedVideo
                    ? 'ring-2 ring-green-500'
                    : ''
                }`}
              >
                <div>
                  <div
                    onClick={() => {
                      onListItemClick({
                        currentVideoDetails: {
                          resourceId: player_embed_url,
                          thumbnailLink: base_link,
                          animatedThumbnailLink: animated_thumbnail,
                        },
                        setWorkInfos,
                        matchedWorkInfo,
                        matchedOwnedVideo,
                        category: matchedOwnedVideo?.category,
                      });
                    }}
                    className={cls(
                      !matchedWorkInfo ? 'hover:ring-2 hover:ring-palettered' : '',
                      'relative cursor-pointer'
                    )}
                  >
                    <Image
                      src={`${base_link}_640x360?r=pad`}
                      alt={`${name} thumbnail`}
                      width={640}
                      height={360}
                      priority={idx < 6 ? true : false}
                      className="w-full"
                    />
                    {animated_thumbnail !== 'no-link' ? (
                      <ul className="w-full h-10 pb-3 px-3 absolute bottom-0 right-0 flex justify-end gap-2">
                        <li className="w-auto text-sm font-semibold bg-palettered p-2 flex justify-center items-center rounded-md">
                          Gif
                        </li>
                      </ul>
                    ) : null}
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-[#bababa] ">Title : {name}</div>
                    <div className="text-xs font-light text-[#bababa] break-words">
                      <span className="whitespace-nowrap">Id : </span>
                      {resource_key}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    name="title"
                    type="text"
                    placeholder="타이틀"
                    data-resourceid={player_embed_url}
                    //여기 썸네일 변경
                    data-thumbnail={base_link}
                    data-animated_thumbnail={animated_thumbnail}
                    data-description={matchedOwnedVideo?.description}
                    data-date={matchedOwnedVideo?.date}
                    data-category={matchedOwnedVideo?.category}
                    data-order={matchedOwnedVideo?.order}
                    onChange={inputChange}
                    onBlur={inputBlur}
                    value={
                      matchedWorkInfo
                        ? matchedWorkInfo.title
                        : matchedOwnedVideo
                        ? matchedOwnedVideo.title
                        : ''
                    }
                  />
                  <Input
                    name="description"
                    type="text"
                    placeholder="직무"
                    data-resourceid={player_embed_url}
                    onChange={inputChange}
                    value={
                      matchedWorkInfo
                        ? matchedWorkInfo.description
                        : matchedOwnedVideo
                        ? matchedOwnedVideo.description
                        : ''
                    }
                  />
                  <Input
                    name="date"
                    type="text"
                    placeholder="날짜"
                    data-resourceid={player_embed_url}
                    onChange={inputChange}
                    value={
                      matchedWorkInfo
                        ? matchedWorkInfo.date
                        : matchedOwnedVideo
                        ? matchedOwnedVideo.date
                        : ''
                    }
                  />
                  <div className="flex h-12">
                    <div className="w-full">
                      <Input
                        name={`${resource_key}`}
                        type="radio"
                        labelName="Film"
                        value="film"
                        data-resourceid={player_embed_url}
                        onChange={inputChange}
                        checked={
                          matchedWorkInfo
                            ? matchedWorkInfo.category === 'film'
                              ? true
                              : false
                            : matchedOwnedVideo?.category === 'film'
                            ? true
                            : false
                        }
                        radioDisabled={matchedWorkInfo ? false : true}
                        labelCss="peer-checked:border-none peer-checked:text-[#eaeaea] peer-checked:font-bold border border-[#606060]"
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        name={`${resource_key}`}
                        type="radio"
                        labelName="Short"
                        value="short"
                        data-resourceid={player_embed_url}
                        onChange={inputChange}
                        checked={
                          matchedWorkInfo
                            ? matchedWorkInfo.category === 'short'
                              ? true
                              : false
                            : matchedOwnedVideo?.category === 'short'
                            ? true
                            : false
                        }
                        radioDisabled={matchedWorkInfo ? false : true}
                        labelCss="peer-checked:border-none peer-checked:text-[#eaeaea] peer-checked:font-bold border border-[#606060]"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ) : null;
          }
        )}
      </ul>
      <div ref={intersectionRef} className="h-32 my-10 order-last">
        {fetchLoading ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <div className="animate-spin-middle contrast-50 absolute w-[40px] aspect-square">
              <Circles
                liMotion={{
                  css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export function YoutubeThumbnailFeed({
  resource,
  workInfos,
  intersectionRef,
  fetchLoading,
  ownedVideos,
  page,
  setWorkInfos,
  inputBlur,
}: YoutubefeedProps) {
  const inputChange = createInputChange(setWorkInfos, workInfos);
  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 ">
        {resource.map((video, idx) => {
          const matchedWorkInfo: WorkInfos | undefined = workInfos?.find(
            (workInfo) => workInfo.resourceId === video.snippet.resourceId?.videoId
          );
          const matchedOwnedVideo: OwnedVideoItems | undefined = ownedVideos.find(
            (ownedVideo) => ownedVideo.resourceId === video.snippet.resourceId?.videoId
          );
          return idx < 12 * (page - 1) ? (
            <li
              key={idx}
              className={`w-full flex flex-col justify-between ${
                matchedWorkInfo
                  ? 'ring-2 ring-palettered'
                  : matchedOwnedVideo
                  ? 'ring-2 ring-green-500'
                  : ''
              }`}
            >
              <div>
                <div
                  onClick={() => {
                    onListItemClick({
                      currentVideoDetails: {
                        resourceId: video.snippet.resourceId?.videoId,
                        thumbnailLink: video.snippet.resourceId?.videoId,
                      },
                      setWorkInfos,
                      matchedOwnedVideo,
                      matchedWorkInfo,
                      category: 'outsource',
                    });
                  }}
                  className={cls(
                    !matchedWorkInfo ? 'hover:ring-2 hover:ring-palettered' : '',
                    'relative cursor-pointer'
                  )}
                >
                  <Image
                    src={
                      resource.length !== 0
                        ? video.snippet.thumbnails.maxres?.url ||
                          video.snippet.thumbnails.medium?.url
                        : ''
                    }
                    alt="Thumbnail not available"
                    width={1280}
                    height={720}
                    priority={idx < 6 ? true : false}
                    className="w-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <div className="text-sm text-[#bababa]">Title : {video.snippet.title}</div>
                  <div className="text-xs font-light text-[#bababa]">
                    Id : {video.snippet.resourceId?.videoId}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  name="title"
                  type="text"
                  placeholder="타이틀"
                  data-resourceid={video.snippet.resourceId?.videoId}
                  data-thumbnail={video.snippet.resourceId?.videoId}
                  data-description={matchedOwnedVideo?.description}
                  data-date={matchedOwnedVideo?.date}
                  data-category={'outsource'}
                  data-order={matchedOwnedVideo?.order}
                  onChange={inputChange}
                  onBlur={inputBlur}
                  value={
                    matchedWorkInfo
                      ? matchedWorkInfo.title
                      : matchedOwnedVideo
                      ? matchedOwnedVideo.title
                      : ''
                  }
                />
                <Input
                  name="description"
                  type="text"
                  placeholder="직무"
                  data-resourceid={video.snippet.resourceId?.videoId}
                  onChange={inputChange}
                  value={
                    matchedWorkInfo
                      ? matchedWorkInfo.description
                      : matchedOwnedVideo
                      ? matchedOwnedVideo.description
                      : ''
                  }
                />
                <Input
                  name="date"
                  type="text"
                  placeholder="날짜"
                  data-resourceid={video.snippet.resourceId?.videoId}
                  onChange={inputChange}
                  value={
                    matchedWorkInfo
                      ? matchedWorkInfo.date
                      : matchedOwnedVideo
                      ? matchedOwnedVideo.date
                      : ''
                  }
                />
              </div>
            </li>
          ) : null;
        })}
      </ul>
      <div ref={intersectionRef} className="h-32 my-10 order-last">
        {fetchLoading ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <div className="animate-spin-middle contrast-50 absolute w-[40px] aspect-square">
              <Circles
                liMotion={{
                  css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
