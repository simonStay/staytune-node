import {DefaultCrudRepository} from '@loopback/repository';
import {BudgetInfo, BudgetInfoRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class BudgetInfoRepository extends DefaultCrudRepository<
  BudgetInfo,
  typeof BudgetInfo.prototype.id,
  BudgetInfoRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(BudgetInfo, dataSource);
  }
}
