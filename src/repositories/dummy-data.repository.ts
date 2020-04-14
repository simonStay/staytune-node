import {DefaultCrudRepository} from '@loopback/repository';
import {DummyData, DummyDataRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DummyDataRepository extends DefaultCrudRepository<
  DummyData,
  typeof DummyData.prototype.ID,
  DummyDataRelations
> {
  constructor(@inject('datasources.stay_tune') dataSource: StayTuneDataSource) {
    super(DummyData, dataSource);
  }
}
