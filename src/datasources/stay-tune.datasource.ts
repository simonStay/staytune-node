import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './stay-tune.datasource.json';

export class StayTuneDataSource extends juggler.DataSource {
  static dataSourceName = 'stay_tune';

  constructor(
    @inject('datasources.config.stay_tune', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
