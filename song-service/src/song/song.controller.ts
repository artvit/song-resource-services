import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SongService } from './song.service';
import { SongDto } from './dto/song.dto';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  create(@Body() createSongDto: SongDto) {
    return this.songService.create(createSongDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @Delete()
  remove(@Query('id') id: string) {
    const ids = id.split(',');
    return this.songService.remove(ids);
  }
}
