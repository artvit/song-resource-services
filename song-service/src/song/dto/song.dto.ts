import { Song, SongDocument } from '../entities/song.entity';

export class SongDto {
  name: string;
  artist: string;
  album: string;
  length: number;
  year: number;
  resourceId: string;
}

export const mapSongToDto = (song: SongDocument): SongDto & { id: string } => ({
  id: song.id,
  name: song.name,
  artist: song.artist,
  album: song.album,
  year: song.year,
  length: song.length,
  resourceId: song.resourceId,
});
