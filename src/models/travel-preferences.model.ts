import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import {User} from './user.model';
import {BudgetInfo} from './budget-info.model';

@model({settings: {strict: false}})
export class TravelPreferences extends Entity {
  @property({
    type: 'array',
    itemType: 'object',
  })
  selectedTravelPreferences?: Array<object>;

  @property({
    type: 'number',
  })
  personsCount?: number;

  @property({
    type: 'number',
  })
  daysCount?: number;

  @property({
    type: 'number',
  })
  totalBudget?: number;

  @property({
    type: 'string',
  })
  city?: string;

  // @property({
  //   type: 'string',
  // })
  // userId?: string;

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
  })
  endDate?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'number',
    default: 0,
  })
  expenditure?: number;

  @property({
    type: 'number',
    default: 0,
  })
  daysLeft?: number;

  @property({
    type: 'array',
    itemType: 'object',
  })
  selectedCategories: Array<object>;

  @hasMany(() => BudgetInfo, {keyTo: 'travelId'})
  budgetinfo: TravelPreferences[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  @property({
    type: 'string',
  })
  userCheck: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<TravelPreferences>) {
    super(data);
  }
}

export interface TravelPreferencesRelations {
  // describe navigational properties here
}

export type TravelPreferencesWithRelations = TravelPreferences &
  TravelPreferencesRelations;
