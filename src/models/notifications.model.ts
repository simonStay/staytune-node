import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {}})
export class Notifications extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
  })
  date?: Date;

  @property({
    type: 'string',
  })
  notification?: string;

  @property({
    type: 'string',
  })
  placeId?: string;

  @property({
    type: 'number',
  })
  lat: number;

  @property({
    type: 'number',
  })
  long: number;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Notifications>) {
    super(data);
  }
}

export interface NotificationsRelations {
  // describe navigational properties here
}

export type NotificationsWithRelations = Notifications & NotificationsRelations;
