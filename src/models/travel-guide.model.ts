import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TravelGuide extends Entity {
  @property({
    type: 'string',
    id: true,

    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;
  @property({
    type: 'array',
    itemType: 'string',
  })
  interests: Array<string>;
  @property({
    type: 'array',
    itemType: 'string',
  })
  places: Array<string>;
  @property({
    type: 'string',
  })
  email: string;
  @property({
    type: 'number',
  })
  phoneNumber: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TravelGuide>) {
    super(data);
  }
}

export interface TravelGuideRelations {
  // describe navigational properties here
}

export type TravelGuideWithRelations = TravelGuide & TravelGuideRelations;
