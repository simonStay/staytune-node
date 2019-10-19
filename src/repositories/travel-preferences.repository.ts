import {Getter} from '@loopback/context';
import {
  DefaultCrudRepository,
  BelongsToAccessor,
  repository,
} from '@loopback/repository';
import {TravelPreferences, User, TravelPreferencesRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {UserRepository} from '../repositories';

export class TravelPreferencesRepository extends DefaultCrudRepository<
  TravelPreferences,
  typeof TravelPreferences.prototype.id,
  TravelPreferencesRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof TravelPreferences.prototype.userId
  >;
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(TravelPreferences, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}
