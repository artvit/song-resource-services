import { Injectable } from '@nestjs/common';
import * as mm from 'music-metadata';
import { SongMetadata } from './song-metadata';
import { InjectModel } from '@nestjs/mongoose';
import { Resource } from './resource.schema';
import { Model } from 'mongoose';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<Resource>,
  ) {}

  async uploadResource(song: Buffer): Promise<object> {
    const parsedMetadata = await mm.parseBuffer(song);
    const songMetadata: SongMetadata = {
      name: parsedMetadata.common.title,
      artist: parsedMetadata.common.artist,
      album: parsedMetadata.common.album,
      year: parsedMetadata.common.year,
      length: parsedMetadata.format.duration,
    };
    const createdResource = new this.resourceModel({ data: song });
    const savedResource = await createdResource.save();
    return { id: savedResource.id };
  }

  async findOne(id: string): Promise<Buffer | undefined> {
    const resource = await this.resourceModel.findById(id).exec();
    return resource?.data;
  }

  async deleteResources(ids: string[]) {
    const findResult = await this.resourceModel.find({ _id: { $in: ids } });
    const foundIds = findResult.map(({ id }) => id);
    await this.resourceModel.deleteMany({ _id: { $in: foundIds } });
    return { ids: foundIds };
  }
}
