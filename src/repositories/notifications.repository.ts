import {
  DefaultCrudRepository,
  BelongsToAccessor,
  repository,
} from '@loopback/repository';
import {Getter} from '@loopback/context';
import {Notifications, NotificationsRelations, User} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {UserRepository} from '../repositories';

export class NotificationsRepository extends DefaultCrudRepository<
  Notifications,
  typeof Notifications.prototype.id,
  NotificationsRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof Notifications.prototype.userId
  >;
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Notifications, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}
