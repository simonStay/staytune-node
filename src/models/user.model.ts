import {Entity, model, property, hasMany} from '@loopback/repository';
import {TravelPreferences} from './travel-preferences.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    // required: true,
  })
  fullname: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    // required: true,
  })
  password: string;

  @property({
    type: 'string',
    default: '',
  })
  token: string;

  @property({
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @property({
    type: 'string',
    default: '',
  })
  firstname: string;

  @property({
    type: 'string',
    default: '',
  })
  lastname: string;

  @property({
    type: 'string',
    default: '',
  })
  city: string;

  @property({
    type: 'string',
    default: '',
  })
  state: string;

  @property({
    type: 'string',
    default: '',
  })
  zip: string;

  @property({
    type: 'string',
    default: '',
  })
  profilePic: string;

  @hasMany(() => TravelPreferences, {keyTo: 'userId'})
  travelpreferences: TravelPreferences[];
  @property({
    type: 'number',
  })
  age: number;

  @property({
    type: 'string',
    default: '',
  })
  maritalStatus: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
