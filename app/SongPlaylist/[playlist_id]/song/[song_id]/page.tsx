"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BASE_API_URL = "https://learn.smktelkom-mlg.sch.id/ukl2";

// Fungsi untuk memformat URL YouTube agar dapat di-embed
function formatYouTubeEmbedURL(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    if (hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }

    if (parsed.pathname.includes("/shorts/")) {
      const id = parsed.pathname.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Jika format URL tidak dikenali
    console.warn("Unrecognized YouTube URL format:", url);
    return "";
  } catch (e) {
    console.error("Invalid YouTube URL:", url, e);
    return "";
  }
}

export default function SongDetailPage() {
  const { song_id } = useParams(); // Mengambil parameter ID lagu dari URL
  const [song, setSong] = useState<any>(null); // State untuk menyimpan data lagu

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data } = await axios.get(`${BASE_API_URL}/playlists/song/${song_id}`);
        if (data.success) {
          setSong(data.data);
        }
      } catch (error) {
        console.error("Error fetching song detail:", error);
      }
    };

    if (song_id) fetchSong();
  }, [song_id]);

  if (!song) return <p className="p-6">Loading...</p>; // Loader saat data belum diambil

  const embedURL = formatYouTubeEmbedURL(song.source); // Format URL video YouTube

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">{song.title}</h1>
        <p className="text-gray-300 text-lg mb-4">🎤 {song.artist}</p>
        <p className="text-gray-400 mb-6">{song.description}</p>

        {/* Bagian untuk menampilkan video */}
        <div className="aspect-video mb-6 rounded-xl overflow-hidden">
          {embedURL ? (
            <iframe
              src={embedURL}
              title={song.title}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            ></iframe>
          ) : (
            <p className="text-red-500">Invalid video URL</p>
          )}
        </div>

        {/* Bagian untuk menampilkan komentar */}
        <h2 className="text-2xl font-semibold text-white mb-4">💬 Komentar</h2>
        <div className="space-y-4">
          {song.comments.map((comment: any, idx: number) => (
            <div
              key={idx}
              className="bg-gray-700 p-4 rounded-lg border border-gray-600"
            >
              <p className="text-white">{comment.comment_text}</p>
              <p className="text-sm text-gray-400 mt-1">
                - {comment.creator} • {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
