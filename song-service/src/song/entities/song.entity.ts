import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ResourceDocument = HydratedDocument<Song>;

@Schema()
export class Song {
  @Prop()
  name: string;

  @Prop()
  artist: string;

  @Prop()
  album: string;

  @Prop()
  length: number;

  @Prop()
  year: number;

  @Prop({ required: true })
  resourceId: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
