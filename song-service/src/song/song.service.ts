import { Injectable } from '@nestjs/common';
import { SongDto } from './dto/song.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Song } from './entities/song.entity';

@Injectable()
export class SongService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async create(createSongDto: SongDto) {
    const createdSong = await this.songModel.create(createSongDto);
    return { id: createdSong.id };
  }

  async findOne(id: string): Promise<SongDto> {
    const foundSong = await this.songModel.findOne({ _id: id });
    return (
      foundSong && {
        name: foundSong.name,
        artist: foundSong.artist,
        album: foundSong.album,
        year: foundSong.year,
        length: foundSong.length,
        resourceId: foundSong.resourceId,
      }
    );
  }

  async remove(ids: string[]) {
    const findResult = await this.songModel.find({ _id: { $in: ids } });
    const foundIds = findResult.map(({ id }) => id);
    await this.songModel.deleteMany({ _id: { $in: foundIds } });
    return { ids: foundIds };
  }
}
