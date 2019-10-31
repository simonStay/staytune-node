import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {TravelPreference} from './travel-preferences.model';

@model({settings: {}})
export class BudgetInfo extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'number',
    default: 0,
  })
  day?: number;

  @property({
    type: 'number',
  })
  mealsExpenditure?: number;

  @property({
    type: 'number',
  })
  entExpenditure?: number;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => TravelPreference)
  travelId: string;

  constructor(data?: Partial<BudgetInfo>) {
    super(data);
  }
}

export interface BudgetInfoRelations {
  // describe navigational properties here
}

export type BudgetInfoWithRelations = BudgetInfo & BudgetInfoRelations;
