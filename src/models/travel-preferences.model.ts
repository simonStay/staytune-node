import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TravelPreferences extends Entity {
  @property({
    type: 'array',
    itemType: 'string',
  })
  selectedTravelPreferences?: string[];

  @property({
    type: 'number',
  })
  personsCount?: number;

  @property({
    type: 'number',
  })
  daysCount?: number;

  @property({
    type: 'string',
  })
  totalBudget?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  locationImage?: string;

  @property({
    type: 'string',
  })
  travelDate?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TravelPreferences>) {
    super(data);
  }
}

export interface TravelPreferencesRelations {
  // describe navigational properties here
}

export type TravelPreferencesWithRelations = TravelPreferences &
  TravelPreferencesRelations;
