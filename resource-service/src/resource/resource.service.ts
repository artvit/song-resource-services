import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as mm from 'music-metadata';
import { SongMetadata } from './song-metadata';
import { InjectModel } from '@nestjs/mongoose';
import { Resource } from './resource.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';

@Injectable()
export class ResourceService {
  private readonly songServiceUrl: string;
  private readonly logger = new Logger(ResourceService.name);

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
    this.logger.log(`Metadata: ${JSON.stringify(songMetadata)}`);
    const createdResource = await this.resourceModel.create({ data: song });
    this.logger.log(`Song binary data stored with id ${createdResource.id}`);
    const songServiceResponse = await fetch(
      `${this.songServiceUrl}/api/songs`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...songMetadata,
          resourceId: createdResource.id,
        }),
      },
    );
    if (songServiceResponse.ok) {
      const responseBody = await songServiceResponse.json();
      this.logger.log(
        `Song metadata was stored in song service: ${responseBody}`,
      );
      return { id: createdResource.id };
    } else {
      const error = await songServiceResponse.json();
      this.logger.error(`Cannot save metadata: ${JSON.stringify(error)}`);
      this.resourceModel.findByIdAndDelete(createdResource.id);
      this.logger.log(`Song data (${createdResource.id}) is removed`);
      throw new BadRequestException({ message: 'Cannot save metadata', error });
    }
  }

  async findOne(id: string): Promise<Buffer | undefined> {
    const resource = await this.resourceModel.findById(id);
    return resource?.data;
  }

  async deleteResources(ids: string[]) {
    const findResult = await this.resourceModel.find({ _id: { $in: ids } });
    const foundIds = findResult.map(({ id }) => id);
    this.logger.log(`Found ids for removal: ${foundIds.join(', ')}`);
    await this.resourceModel.deleteMany({ _id: { $in: foundIds } });
    this.logger.log('Data for found ids are removed');
    return { ids: foundIds };
  }
}
