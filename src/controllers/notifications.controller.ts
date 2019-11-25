import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Notifications} from '../models';
import {NotificationsRepository} from '../repositories';

export class NotificationsController {
  constructor(
    @repository(NotificationsRepository)
    public notificationsRepository: NotificationsRepository,
  ) {}

  @post('/notifications', {
    responses: {
      '200': {
        description: 'Notifications model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Notifications)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notifications, {exclude: ['id']}),
        },
      },
    })
    notifications: Omit<Notifications, 'id'>,
  ): Promise<Notifications> {
    return this.notificationsRepository.create(notifications);
  }

  @get('/notifications/count', {
    responses: {
      '200': {
        description: 'Notifications model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Notifications))
    where?: Where<Notifications>,
  ): Promise<Count> {
    return this.notificationsRepository.count(where);
  }

  @get('/notifications', {
    responses: {
      '200': {
        description: 'Array of Notifications model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Notifications)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Notifications))
    filter?: Filter<Notifications>,
  ): Promise<Notifications[]> {
    return this.notificationsRepository.find(filter);
  }

  @patch('/notifications', {
    responses: {
      '200': {
        description: 'Notifications PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notifications, {partial: true}),
        },
      },
    })
    notifications: Notifications,
    @param.query.object('where', getWhereSchemaFor(Notifications))
    where?: Where<Notifications>,
  ): Promise<Count> {
    return this.notificationsRepository.updateAll(notifications, where);
  }

  @get('/notifications/{id}', {
    responses: {
      '200': {
        description: 'Notifications model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Notifications)},
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Notifications> {
    return this.notificationsRepository.findById(id);
  }

  @patch('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notifications PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notifications, {partial: true}),
        },
      },
    })
    notifications: Notifications,
  ): Promise<void> {
    await this.notificationsRepository.updateById(id, notifications);
  }

  @put('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notifications PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notifications: Notifications,
  ): Promise<void> {
    await this.notificationsRepository.replaceById(id, notifications);
  }

  @del('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notifications DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.notificationsRepository.deleteById(id);
  }
}
