import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Avathars extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Avathars>) {
    super(data);
  }
}

export interface AvatharsRelations {
  // describe navigational properties here
}

export type AvatharsWithRelations = Avathars & AvatharsRelations;
