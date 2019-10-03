import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Categories extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  categoryname?: string;

  @property({
    type: 'string',
  })
  parentcategory?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Categories>) {
    super(data);
  }
}

export interface CategoriesRelations {
  // describe navigational properties here
}

export type CategoriesWithRelations = Categories & CategoriesRelations;
