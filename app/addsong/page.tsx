"use client";

import { useState } from "react";
import axios from "axios";

const BASE_API_URL = "https://learn.smktelkom-mlg.sch.id/ukl2";

export default function AddSongPage() {
  const [formData, setFormData] = useState<{
  title: string;
  artist: string;
  description: string;
  source: string;
  thumbnail: File | null;
}>({
  title: "",
  artist: "",
  description: "",
  source: "",
  thumbnail: null,
});
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, thumbnail: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const songFormData = new FormData();
    songFormData.append("title", formData.title);
    songFormData.append("artist", formData.artist);
    songFormData.append("description", formData.description);
    songFormData.append("source", formData.source);
    if (formData.thumbnail) {
      songFormData.append("thumbnail", formData.thumbnail);
    }

    try {
      const { data } = await axios.post(`${BASE_API_URL}/playlists/song`, songFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setMessage("🎉 Lagu berhasil ditambahkan!");
        setFormData({ title: "", artist: "", description: "", source: "", thumbnail: null });
      } else {
        setMessage("❌ Gagal menambahkan lagu: " + data.message);
      }
    } catch (error) {
      console.error("Error adding song:", error);
      setMessage("❌ Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Tambah Lagu Baru</h1>

        {message && (
          <p
            className={`text-center mb-4 font-semibold ${
              message.includes("berhasil") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-300 mb-2">
              Judul Lagu
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="artist" className="block text-gray-300 mb-2">
              Artis
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-300 mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="source" className="block text-gray-300 mb-2">
              Sumber Video (YouTube URL)
            </label>
            <input
              type="url"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="thumbnail" className="block text-gray-300 mb-2">
              Thumbnail (PNG, JPG, JPEG max 2MB)
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full bg-gray-700 text-gray-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Tambah Lagu
          </button>
        </form>
      </div>
    </div>
  );
}
