import Image from 'next/image';
import Input from './input';
import Circles from './circles';
import { VimeofeedProps, YoutubefeedProps } from './typings/components';
import { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import { WorkInfos } from '@/pages/work/write';

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
            resourceId: dataset.resourceid || '',
            title: value,
            description: dataset.description || '',
            category: dataset.category || '',
            date: dataset.date || '',
            thumbnailLink: dataset.thumbnail || '',
            animatedThumbnailLink: dataset.animated_thumbnail || '',
          },
        ]);
      }
    }
  };
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
        {resource.map((video, idx) => {
          const matchedWorkInfos = workInfos?.find(
            (workInfo) => workInfo.resourceId === video.player_embed_url
          );
          const matchedOwnedVideos = ownedVideos.find(
            (ownedVideo) => ownedVideo.resourceId === video.player_embed_url
          );

          return idx < 12 * (page - 1) ? (
            <div
              key={idx} /* video.resource_key */
              className={`w-full flex flex-col justify-between ${
                matchedWorkInfos
                  ? 'ring-2 ring-palettered'
                  : matchedOwnedVideos
                  ? 'ring-2 ring-green-500'
                  : ''
              }`}
            >
              <div>
                <div className="relative">
                  <Image
                    src={`${video.pictures.base_link}_640x360?r=pad`}
                    alt={`${video.name} thumbnail`}
                    width={640}
                    height={360}
                    priority={idx < 6 ? true : false}
                    className="w-full"
                  />
                  {video.animated_thumbnail !== 'no-link' ? (
                    <ul className="w-full h-10 pb-3 px-3 absolute bottom-0 right-0 flex justify-end gap-2">
                      <li className="w-auto text-sm font-semibold bg-palettered p-2 flex justify-center items-center rounded-md">
                        Thumb
                      </li>
                    </ul>
                  ) : null}
                </div>
                <div className="mt-2">
                  <div className="text-sm text-[#bababa] ">Title : {video.name}</div>
                  <div className="text-xs font-light text-[#bababa] break-words">
                    <span className="whitespace-nowrap">Id : </span>
                    {video.resource_key}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  name="title"
                  type="text"
                  placeholder="타이틀"
                  data-resourceid={video.player_embed_url}
                  //여기 썸네일 변경
                  data-thumbnail={video.pictures.base_link}
                  data-animated_thumbnail={video.animated_thumbnail}
                  data-description={matchedOwnedVideos?.description}
                  data-date={matchedOwnedVideos?.date}
                  data-category={matchedOwnedVideos?.category}
                  onChange={inputChange}
                  onBlur={inputBlur}
                  value={
                    matchedWorkInfos
                      ? matchedWorkInfos.title
                      : matchedOwnedVideos
                      ? matchedOwnedVideos.title
                      : ''
                  }
                />
                <Input
                  name="description"
                  type="text"
                  placeholder="직무"
                  data-resourceid={video.player_embed_url}
                  onChange={inputChange}
                  value={
                    matchedWorkInfos
                      ? matchedWorkInfos.description
                      : matchedOwnedVideos
                      ? matchedOwnedVideos.description
                      : ''
                  }
                />
                <Input
                  name="date"
                  type="text"
                  placeholder="날짜"
                  data-resourceid={video.player_embed_url}
                  onChange={inputChange}
                  value={
                    matchedWorkInfos
                      ? matchedWorkInfos.date
                      : matchedOwnedVideos
                      ? matchedOwnedVideos.date
                      : ''
                  }
                />
                <div className="flex h-12">
                  <div className="w-full">
                    <Input
                      name={`${video.resource_key}`}
                      type="radio"
                      labelName="Film"
                      value="film"
                      data-resourceid={video.player_embed_url}
                      onChange={inputChange}
                      checked={
                        matchedWorkInfos
                          ? matchedWorkInfos.category === 'film'
                            ? true
                            : false
                          : matchedOwnedVideos?.category === 'film'
                          ? true
                          : false
                      }
                      radioDisabled={matchedWorkInfos ? false : true}
                      labelCss="peer-checked:border-none peer-checked:text-[#eaeaea] peer-checked:font-bold border border-[#606060]"
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      name={`${video.resource_key}`}
                      type="radio"
                      labelName="Short"
                      value="short"
                      data-resourceid={video.player_embed_url}
                      onChange={inputChange}
                      checked={
                        matchedWorkInfos
                          ? matchedWorkInfos.category === 'short'
                            ? true
                            : false
                          : matchedOwnedVideos?.category === 'short'
                          ? true
                          : false
                      }
                      radioDisabled={matchedWorkInfos ? false : true}
                      labelCss="peer-checked:border-none peer-checked:text-[#eaeaea] peer-checked:font-bold border border-[#606060]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 ">
        {resource.map((video, idx) => {
          const matchedWorkInfos = workInfos?.find(
            (workInfo) => workInfo.resourceId === video.snippet.resourceId?.videoId
          );
          const matchedOwnedVideos = ownedVideos.find(
            (ownedVideo) => ownedVideo.resourceId === video.snippet.resourceId?.videoId
          );
          return idx < 12 * (page - 1) ? (
            <div
              key={idx}
              className={`w-full flex flex-col justify-between ${
                matchedWorkInfos
                  ? 'ring-2 ring-palettered'
                  : matchedOwnedVideos
                  ? 'ring-2 ring-green-500'
                  : ''
              }`}
            >
              <div>
                <Image
                  src={
                    resource.length !== 0
                      ? video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.medium?.url
                      : ''
                  }
                  alt="Thumbnail not available"
                  width={1280}
                  height={720}
                  priority={idx < 6 ? true : false}
                  className="w-full object-cover"
                />
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
                  data-description={matchedOwnedVideos?.description}
                  data-date={matchedOwnedVideos?.date}
                  data-category={matchedOwnedVideos?.category}
                  onChange={inputChange}
                  onBlur={inputBlur}
                  value={
                    matchedWorkInfos
                      ? matchedWorkInfos.title
                      : matchedOwnedVideos
                      ? matchedOwnedVideos.title
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
                    matchedWorkInfos
                      ? matchedWorkInfos.description
                      : matchedOwnedVideos
                      ? matchedOwnedVideos.description
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
                    matchedWorkInfos
                      ? matchedWorkInfos.date
                      : matchedOwnedVideos
                      ? matchedOwnedVideos.date
                      : ''
                  }
                />
              </div>
            </div>
          ) : null;
        })}
      </div>
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
