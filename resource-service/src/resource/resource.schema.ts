import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ResourceDocument = HydratedDocument<Resource>;

@Schema()
export class Resource {
  @Prop()
  data: Buffer;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
