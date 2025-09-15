"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Playlist {
  uuid: string;
  playlist_name: string;
  song_count: number;
}

const SongPlaylistPage = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    axios
      .get("https://learn.smktelkom-mlg.sch.id/ukl2/playlists")
      .then((response) => {
        if (response.data.success) {
          setPlaylists(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <Image
            alt=""
            width={120}
            height={120}
            src={"/image/logo.jpg"}
            className="rounded-full mx-auto mb-4"
          />
          <h4 className="text-2xl uppercase font-semibold text-white mb-2">
            Sehati's Playlist
          </h4>
          <span className="text-sm text-gray-400 font-medium">
            Habis ini lulus..
          </span>
        </div>
      <div className="w-full space-y-4">
        {playlists.map((playlist) => (
          <div
              key={playlist.uuid}
              onClick={() => router.push(`/SongPlaylist/${playlist.uuid}`)}
              className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{playlist.playlist_name}</h2>
                  <p className="text-gray-400 text-sm">Song count: {playlist.song_count}</p>
                </div>
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                </div>
              </div>
            </div>
          // <div
          //   key={playlist.uuid}
          //   onClick={() => router.push(`/SongPlaylist/${playlist.uuid}`)}
          //   className="bg-gray-800 text-white p-4 rounded-lg mb-2 cursor-pointer"
          // >
          //   <h3 className="text-lg">{playlist.playlist_name}</h3>
          //   <p className="text-sm">Songs: {playlist.song_count}</p>
          // </div>
        ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SongPlaylistPage;
