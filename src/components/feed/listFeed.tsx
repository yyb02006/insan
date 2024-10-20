import { cls } from '@/libs/client/utils';
import Circles from '@/components/circles';
import Input from '@/components/input';
import { useState } from 'react';
import Image from 'next/image';
import { VimeofeedProps, YoutubefeedProps } from '@/components/typings/components';
import { createInputChange, onListItemClick } from '@/components/feed/thumbnailFeed';
import { OwnedVideoItems, WorkInfos } from '@/pages/work/work';
import useScrollLock from '@/libs/client/useScrollLock';

const VimeoThumbnailPreview = ({
  altName,
  baseLink,
  idx,
}: {
  baseLink: string;
  altName: string;
  idx: number;
}) => {
  const [isThumbnailOpen, setIsThumbnailOpen] = useScrollLock();
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsThumbnailOpen((p) => !p);
      }}
      className="text-xs sm:text-sm font-normal cursor-pointer hover:text-palettered"
    >
      <span className="whitespace-nowrap text-[#888888] hover:text-palettered">( 미리보기 )</span>
      {isThumbnailOpen ? (
        <div className="fixed z-[1001] w-screen h-screen left-0 top-0 flex justify-center items-center">
          <div className="bg-black opacity-80 w-full h-full absolute left-0 top-0"></div>
          <Image
            src={`${baseLink}_640x360?r=pad`}
            alt={`${altName} thumbnail`}
            width={640}
            height={360}
            priority={idx < 6 ? true : false}
            className="relative"
          />
        </div>
      ) : null}
    </span>
  );
};

export function VimeoListFeed({
  resource,
  workInfos,
  intersectionRef,
  fetchLoading,
  ownedVideos,
  page,
  setWorkInfos,
  inputBlur,
}: VimeofeedProps) {
  const alterColor = 'bg-[#1a1a1a]';
  const inputChange = createInputChange(setWorkInfos, workInfos);
  return (
    <>
      <ul className="space-y-4">
        {resource.map((video, idx) => {
          const matchedWorkInfo: WorkInfos | undefined = workInfos?.find(
            (workInfo) => workInfo.resourceId === video.player_embed_url
          );
          const matchedOwnedVideo: OwnedVideoItems | undefined = ownedVideos.find(
            (ownedVideo) => ownedVideo.resourceId === video.player_embed_url
          );
          return idx < 12 * (page - 1) ? (
            <li
              key={idx} /* video.resource_key */
              className={`w-full py-2 ${idx % 2 === 0 ? alterColor : ''} ${
                matchedWorkInfo
                  ? 'ring-1 ring-palettered'
                  : matchedOwnedVideo
                  ? 'ring-1 ring-green-500'
                  : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="ml-3 text-lg font-bold text-[#bababa] ">
                  <div
                    onClick={() => {
                      onListItemClick({
                        currentVideoDetails: {
                          resourceId: video.player_embed_url,
                          thumbnailLink: video.pictures.base_link,
                          animatedThumbnailLink: video.animated_thumbnail,
                        },
                        setWorkInfos,
                        matchedOwnedVideo,
                        matchedWorkInfo,
                        category: matchedOwnedVideo?.category || 'film',
                      });
                    }}
                    className="inline-block group hover:text-palettered cursor-pointer"
                  >
                    <span
                      className={cls(
                        'group-hover:text-palettered',
                        matchedWorkInfo
                          ? 'text-palettered'
                          : matchedOwnedVideo
                          ? 'text-green-500'
                          : ''
                      )}
                    >{`${idx + 1}. `}</span>
                    <span className="mr-2">{video.name}</span>
                  </div>
                  {video.animated_thumbnail !== 'no-link' ? (
                    <span className="text-xs mr-2 text-[#eaeaea] font-semibold bg-palettered inline-flex p-1 rounded-md">
                      Gif
                    </span>
                  ) : null}
                  <VimeoThumbnailPreview
                    altName={video.name}
                    baseLink={video.pictures.base_link}
                    idx={idx}
                  />
                </div>
                <div className="min-w-[30%] w-[30%] flex h-10">
                  <div className="w-full">
                    <Input
                      name={`${video.resource_key}`}
                      type="radio"
                      labelName="Film"
                      value="film"
                      data-resourceid={video.player_embed_url}
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
                      labelCss={cls(
                        idx % 2 === 0 ? alterColor : '',
                        'peer-checked:border-none peer-checked:text-[#eaeaea] peer-checked:font-bold border border-[#606060]'
                      )}
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
                        matchedWorkInfo
                          ? matchedWorkInfo.category === 'short'
                            ? true
                            : false
                          : matchedOwnedVideo?.category === 'short'
                          ? true
                          : false
                      }
                      radioDisabled={matchedWorkInfo ? false : true}
                      labelCss={cls(
                        idx % 2 === 0 ? alterColor : '',
                        'peer-checked:border-none peer-checked:text-[#eaeaea] peer-checked:font-bold border border-[#606060]'
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <Input
                  name="title"
                  type="text"
                  placeholder="타이틀"
                  data-resourceid={video.player_embed_url}
                  //여기 썸네일 변경
                  data-thumbnail={video.pictures.base_link}
                  data-animated_thumbnail={video.animated_thumbnail}
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
                  css={cls(idx % 2 === 0 ? alterColor : '', 'text-sm text-[#aaaaaa]')}
                />
                <Input
                  name="description"
                  type="text"
                  placeholder="직무"
                  data-resourceid={video.player_embed_url}
                  onChange={inputChange}
                  value={
                    matchedWorkInfo
                      ? matchedWorkInfo.description
                      : matchedOwnedVideo
                      ? matchedOwnedVideo.description
                      : ''
                  }
                  css={cls(idx % 2 === 0 ? alterColor : '', 'text-sm text-[#aaaaaa]')}
                />
                <Input
                  name="date"
                  type="text"
                  placeholder="날짜"
                  data-resourceid={video.player_embed_url}
                  onChange={inputChange}
                  value={
                    matchedWorkInfo
                      ? matchedWorkInfo.date
                      : matchedOwnedVideo
                      ? matchedOwnedVideo.date
                      : ''
                  }
                  css={cls(idx % 2 === 0 ? alterColor : '', 'text-sm text-[#aaaaaa]')}
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

const YoutubeThumbnailPreview = ({ imageLink, idx }: { imageLink: string; idx: number }) => {
  const [onThumbnail, setOnThumbnail] = useScrollLock();
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setOnThumbnail((p) => !p);
      }}
      className="text-xs sm:text-sm ml-2 font-normal cursor-pointer hover:text-palettered"
    >
      <span className="whitespace-nowrap">( 썸네일 보기 )</span>
      {onThumbnail ? (
        <div className="fixed z-[1000] w-screen h-screen left-0 top-0 flex justify-center items-center">
          <div className="bg-black opacity-80 w-full h-full absolute left-0 top-0"></div>
          <Image
            src={imageLink}
            alt={`Thumbnail not available`}
            width={640}
            height={360}
            priority={idx < 6 ? true : false}
            className="relative"
          />
        </div>
      ) : null}
    </span>
  );
};

export function YoutubeListFeed({
  resource,
  workInfos,
  intersectionRef,
  fetchLoading,
  ownedVideos,
  page,
  setWorkInfos,
  inputBlur,
}: YoutubefeedProps) {
  const alterColor = 'bg-[#1a1a1a]';
  const inputChange = createInputChange(setWorkInfos, workInfos);
  return (
    <>
      <ul className="space-y-4">
        {resource.map((video, idx) => {
          const matchedWorkInfo: WorkInfos | undefined = workInfos?.find(
            (workInfo) => workInfo.resourceId === video.snippet.resourceId?.videoId
          );
          const matchedOwnedVideo: OwnedVideoItems | undefined = ownedVideos.find(
            (ownedVideo) => ownedVideo.resourceId === video.snippet.resourceId?.videoId
          );
          return idx < 12 * (page - 1) ? (
            <li
              key={idx} /* video.resource_key */
              className={`w-full py-2 ${idx % 2 === 0 ? alterColor : ''} ${
                matchedWorkInfo
                  ? 'ring-1 ring-palettered'
                  : matchedOwnedVideo
                  ? 'ring-1 ring-green-500'
                  : ''
              }`}
            >
              <div className="ml-3 text-lg font-bold text-[#bababa] ">
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
                  className="inline-block group hover:text-palettered cursor-pointer"
                >
                  <span
                    className={cls(
                      'group-hover:text-palettered',
                      matchedWorkInfo
                        ? 'text-palettered'
                        : matchedOwnedVideo
                        ? 'text-green-500'
                        : ''
                    )}
                  >{`${idx + 1}. `}</span>
                  <span>{video.snippet.title} </span>
                </div>
                <YoutubeThumbnailPreview
                  imageLink={
                    resource.length !== 0
                      ? video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.medium?.url
                      : ''
                  }
                  idx={idx}
                />
              </div>
              <div className="mt-2 flex items-center">
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
                  css={cls(idx % 2 === 0 ? alterColor : '', 'text-sm text-[#aaaaaa]')}
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
                  css={cls(idx % 2 === 0 ? alterColor : '', 'text-sm text-[#aaaaaa]')}
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
                  css={cls(idx % 2 === 0 ? alterColor : '', 'text-sm text-[#aaaaaa]')}
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
