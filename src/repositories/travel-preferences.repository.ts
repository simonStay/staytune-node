import {DefaultCrudRepository} from '@loopback/repository';
import {TravelPreferences, TravelPreferencesRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TravelPreferencesRepository extends DefaultCrudRepository<
  TravelPreferences,
  typeof TravelPreferences.prototype.id,
  TravelPreferencesRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(TravelPreferences, dataSource);
  }
}
