import {DefaultCrudRepository} from '@loopback/repository';
import {User, UserRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.ID,
  UserRelations
> {
  constructor(@inject('datasources.stay_tune') dataSource: StayTuneDataSource) {
    super(User, dataSource);
  }
}
