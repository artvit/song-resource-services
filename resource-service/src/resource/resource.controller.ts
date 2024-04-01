import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { Request, Response } from 'express';

@Controller()
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  postSongResource(@Req() req: RawBodyRequest<Request>) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Content type should be audio/mpeg');
    }
    return this.resourceService.uploadResource(rawBody);
  }

  @Get(':id')
  @Header('Content-Type', 'audio/mpeg')
  @Header('Content-Disposition', 'attachment; filename="song.mp3"')
  async getSongResource(@Param('id') id: string): Promise<StreamableFile> {
    const data = await this.resourceService.findOne(id);
    if (data) {
      return new StreamableFile(data);
    } else {
      throw new NotFoundException('no resource with id ' + id);
    }
  }

  @Delete()
  deleteResources(@Query('id') idString: string) {
    const ids = idString.split(',');
    return this.resourceService.deleteResources(ids);
  }
}
