import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class DummyData extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    default: Date.now(),
  })
  timeStamp: Date;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  deviceId?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DummyData>) {
    super(data);
  }
}

export interface DummyDataRelations {
  // describe navigational properties here
}

export type DummyDataWithRelations = DummyData & DummyDataRelations;
