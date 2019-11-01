import {DefaultCrudRepository, repository} from '@loopback/repository';
import {BudgetInfo, BudgetInfoRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from '../repositories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {TravelPreferencesRepository} from '../repositories/travel-preferences.repository';

export class BudgetInfoRepository extends DefaultCrudRepository<
  BudgetInfo,
  typeof BudgetInfo.prototype.id,
  BudgetInfoRelations
> {
  user: any;
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('TravelPreferencesRepository')
    TravelPreferencesRepositoryGetter: Getter<TravelPreferencesRepository>,
  ) {
    super(BudgetInfo, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.user = this.createBelongsToAccessorFor(
      'user',
      TravelPreferencesRepositoryGetter,
    );
  }
}
