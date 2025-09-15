export interface ISong {
  title: string;
  artist: string;
  description: string;
  source: string;
  thumbnail: string;
}

export interface IPlaylist {
  uuid: string;
  playlist_name: string;
  song_count: number;
}