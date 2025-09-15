"use client";

import axios from "axios";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BASE_API_URL = "https://learn.smktelkom-mlg.sch.id/ukl2";

export default function PlaylistDetailPage() {
  const { playlist_id } = useParams();
  const router = useRouter();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const query = search ? `?search=${search}` : "";
        const { data } = await axios.get(`${BASE_API_URL}/playlists/song-list/${playlist_id}${query}`);
        if (data?.success) {
          setSongs(data.data);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    if (playlist_id) fetchSongs();
  }, [playlist_id, search]);

  return (
  <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
         Lagu dalam Playlist
      </h1>

      <input
        type="text"
        placeholder="Cari berdasarkan judul atau artist..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
      />
          

      <div className="mb-4">
        {songs.map((song: any) => {
          const thumbnailUrl = `${BASE_API_URL}/thumbnail/${encodeURIComponent(song.thumbnail)}`;
          return (
            <div
              key={song.uuid}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex gap-4 items-center hover:bg-gray-700 cursor-pointer mb-4"
              onClick={() =>
                router.push(`/SongPlaylist/${playlist_id}/song/${song.uuid}`)
              }
            >
              <Image
                src={thumbnailUrl}
                alt={song.title}
                width={100}
                height={100}
                className="rounded-xl object-cover shadow-md"
                unoptimized
              />
              <div>
                <h2 className="text-xl font-semibold text-white">{song.title}</h2>
                <p className="text-gray-300 text-sm">🎤 {song.artist}</p>
                <p className="text-gray-400 text-sm">{song.description}</p>
              </div>
            </div>
          );
        })}
      </div>
       {/* Tambahkan tombol Add Song */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4  rounded-lg"
            onClick={() => router.push(`/addsong`)}>
              + Tambah Lagu
            </button>
    </div>
  </div>
  </div>
);

}
