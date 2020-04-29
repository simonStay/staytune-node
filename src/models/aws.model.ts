import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Aws extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    default: 'AKIAVPIPZG7WIVCBNST5',
  })
  accessKey?: string;

  @property({
    type: 'string',
    default: 'o5IV + LLlIX5aMKuHYFo / V4j6DFo5mQ + SbP6MRdQv',
  })
  secretKey?: string;

  @property({
    type: 'string',
    default:
      'https://stay-tune-avatars.s3-us-west-2.amazonaws.com/profile-pictures/',
  })
  URL?: string;

  @property({
    type: 'string',
    default: 'stay-tune-avatars',
  })
  bucketName?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Aws>) {
    super(data);
  }
}

export interface AwsRelations {
  // describe navigational properties here
}

export type AwsWithRelations = Aws & AwsRelations;
