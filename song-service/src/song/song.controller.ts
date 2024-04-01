import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { SongService } from './song.service';
import { SongDto } from './dto/song.dto';

@Controller('songs')
export class SongController {
  private readonly logger = new Logger(SongController.name);

  constructor(private readonly songService: SongService) {}

  @Post()
  create(@Body() createSongDto: SongDto) {
    return this.songService.create(createSongDto);
  }

  @Get()
  findAll() {
    return this.songService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.songService.findOne(id);
    if (result) {
      return result;
    } else {
      throw new NotFoundException('Song not found');
    }
  }

  @Delete()
  remove(@Query('id') id: string) {
    const ids = id.split(',');
    return this.songService.remove(ids);
  }
}
