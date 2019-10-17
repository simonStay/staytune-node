import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TravelPreferenceTypes extends Entity {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
    id: true,
    required: true,
    generated: true,
  })
  id: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TravelPreferenceTypes>) {
    super(data);
  }
}

export interface TravelPreferenceTypesRelations {
  // describe navigational properties here
}

export type TravelPreferenceTypesWithRelations = TravelPreferenceTypes & TravelPreferenceTypesRelations;
