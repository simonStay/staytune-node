import {DefaultCrudRepository} from '@loopback/repository';
import {TravelPreferenceTypes, TravelPreferenceTypesRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TravelPreferenceTypesRepository extends DefaultCrudRepository<
  TravelPreferenceTypes,
  typeof TravelPreferenceTypes.prototype.name,
  TravelPreferenceTypesRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(TravelPreferenceTypes, dataSource);
  }
}
