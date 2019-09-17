import {DefaultCrudRepository} from '@loopback/repository';
import {Admin, AdminRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AdminRepository extends DefaultCrudRepository<
  Admin,
  typeof Admin.prototype.id,
  AdminRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(Admin, dataSource);
  }
}
