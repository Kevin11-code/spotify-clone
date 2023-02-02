import { SpeakerWaveIcon as VolumeDownIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon as VolumeUpIcon } from "@heroicons/react/24/solid";
import {
  BackwardIcon,
  PauseIcon,
  PlayIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo(currentTrackId);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 300),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-sm text-gray-500">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon
          onClick={() => spotifyApi.setShuffle()}
          className="button"
        />
        <BackwardIcon
          onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon
            className="button h-10 w-10 text-[#18D860]"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon className="button h-10 w-10" onClick={handlePlayPause} />
        )}
        <ForwardIcon
          className="button"
          onClick={() => spotifyApi.skipToNext()}
        />
        <ArrowUturnLeftIcon
          className="button"
          onClick={() => spotifyApi.setRepeat()}
        />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end p-5">
        <VolumeDownIcon
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          className="w-14 md:w-36 "
        />
        <VolumeUpIcon
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
