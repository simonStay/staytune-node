import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './email.datasource.json';

export class EmailDataSource extends juggler.DataSource {
  static dataSourceName = 'email';

  constructor(
    @inject('datasources.config.email', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
