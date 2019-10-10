import {Entity, model, property} from '@loopback/repository';

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
