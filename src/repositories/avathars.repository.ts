import {DefaultCrudRepository} from '@loopback/repository';
import {Avathars, AvatharsRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AvatharsRepository extends DefaultCrudRepository<
  Avathars,
  typeof Avathars.prototype.id,
  AvatharsRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(Avathars, dataSource);
  }
}
