import {DefaultCrudRepository} from '@loopback/repository';
import {Categories, CategoriesRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CategoriesRepository extends DefaultCrudRepository<
  Categories,
  typeof Categories.prototype.categoryname,
  CategoriesRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(Categories, dataSource);
  }
}
