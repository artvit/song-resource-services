import { SongDocument } from '../entities/song.entity';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class SongDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  artist: string;

  @IsOptional()
  album: string;

  @IsPositive()
  length: number;

  @IsOptional()
  @IsPositive()
  year: number;

  @IsNotEmpty()
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
