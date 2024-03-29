import { Injectable } from '@nestjs/common';
import * as mm from 'music-metadata';
import { SongMetadata } from './song-metadata';
import { InjectModel } from '@nestjs/mongoose';
import { Resource } from './resource.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResourceService {
  private readonly songServiceUrl: string;

  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<Resource>,
    configService: ConfigService,
  ) {
    this.songServiceUrl = configService.get('SONG_SERVICE_URL');
  }

  async uploadResource(song: Buffer): Promise<object> {
    const parsedMetadata = await mm.parseBuffer(song);
    const songMetadata: SongMetadata = {
      name: parsedMetadata.common.title,
      artist: parsedMetadata.common.artist,
      album: parsedMetadata.common.album,
      year: parsedMetadata.common.year,
      length: parsedMetadata.format.duration,
    };
    const createdResource = await this.resourceModel.create({ data: song });
    await fetch(`${this.songServiceUrl}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...songMetadata, resourceId: createdResource.id }),
    });
    return { id: createdResource.id };
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
