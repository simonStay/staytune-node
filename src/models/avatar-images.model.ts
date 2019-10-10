import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class AvatarImages extends Entity {
  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'string',
    id: true,
  })
  id: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AvatarImages>) {
    super(data);
  }
}

export interface AvatarImagesRelations {
  // describe navigational properties here
}

export type AvatarImagesWithRelations = AvatarImages & AvatarImagesRelations;
