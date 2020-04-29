import {DefaultCrudRepository} from '@loopback/repository';
import {Aws, AwsRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AwsRepository extends DefaultCrudRepository<
  Aws,
  typeof Aws.prototype.ID,
  AwsRelations
> {
  constructor(@inject('datasources.stay_tune') dataSource: StayTuneDataSource) {
    super(Aws, dataSource);
  }
}
