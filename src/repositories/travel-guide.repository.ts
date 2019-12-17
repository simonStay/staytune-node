import {DefaultCrudRepository} from '@loopback/repository';
import {TravelGuide, TravelGuideRelations} from '../models';
import {StayTuneDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TravelGuideRepository extends DefaultCrudRepository<
  TravelGuide,
  typeof TravelGuide.prototype.id,
  TravelGuideRelations
> {
  constructor(
    @inject('datasources.stay_tune') dataSource: StayTuneDataSource,
  ) {
    super(TravelGuide, dataSource);
  }
}
