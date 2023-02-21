import VolumeUpIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffIcon from "@mui/icons-material/VolumeOffOutlined";
import { PauseIcon } from "@heroicons/react/24/solid";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import ShuffleIcon from "@mui/icons-material/ShuffleRounded";
import RepeatIcon from "@mui/icons-material/RepeatRounded";
import RepeatOneIcon from "@mui/icons-material/RepeatOneRounded";
import ForwardIcon from "@mui/icons-material/SkipNextRounded";
import BackwardIcon from "@mui/icons-material/SkipPreviousRounded";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [shuffle, toggleShuffle] = useState(true);
  const [repeat, setRepeat] = useState(0);

  const songInfo = useSongInfo(currentTrackId);

  const toggleRepeat = () => {
    const repeatArr = ["context", "track", "off"];
    setRepeat((prev) => (prev + 1) % 3);
    spotifyApi.setRepeat(repeatArr[repeat]);
  };

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

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      spotifyApi.setVolume(volume);
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
        <ShuffleIcon
          onClick={() => {
            spotifyApi.setShuffle(shuffle);
            toggleShuffle((prev) => !prev);
          }}
          className={shuffle ? "button" : "button text-green-400"}
        />

        <BackwardIcon
          onClick={() => spotifyApi.skipToPrevious()}
          className="button h-8 w-8"
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
          className="button h-8 w-8"
          onClick={() => spotifyApi.skipToNext()}
        />
        <div>
          {repeat === 0 ? (
            <RepeatIcon className="button" onClick={toggleRepeat} />
          ) : repeat === 1 ? (
            <RepeatIcon
              className="button text-green-400"
              onClick={toggleRepeat}
            />
          ) : (
            <RepeatOneIcon
              className="button text-green-400"
              onClick={toggleRepeat}
            />
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end p-5">
        {volume ? (
          <div
            className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
            onClick={() => setVolume(0)}
          >
            <VolumeUpIcon />
          </div>
        ) : (
          <div
            className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
            onClick={() => setVolume(50)}
          >
            <VolumeOffIcon />
          </div>
        )}
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          className="range w-[90px] md:w-36 h-[3px] cursor-pointer rounded-3xl border-none"
        />
      </div>
    </div>
  );
}

export default Player;
