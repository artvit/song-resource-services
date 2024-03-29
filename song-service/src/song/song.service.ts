import { Injectable } from '@nestjs/common';
import { mapSongToDto, SongDto } from './dto/song.dto';
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
    return foundSong && mapSongToDto(foundSong);
  }

  async findAll(): Promise<SongDto[]> {
    const found = await this.songModel.find();
    return found.map(mapSongToDto);
  }

  async remove(ids: string[]) {
    const findResult = await this.songModel.find({ _id: { $in: ids } });
    const foundIds = findResult.map(({ id }) => id);
    await this.songModel.deleteMany({ _id: { $in: foundIds } });
    return { ids: foundIds };
  }
}
