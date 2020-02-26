import {Count, CountSchema, repository, Where} from '@loopback/repository';
import {
  post,
  param,
  get,
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

  @post('/notificationslist', {
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
  async findByUserId(@requestBody() body: any): Promise<any> {
    const list: any = [];
    const data: any = await this.notificationsRepository.find(
      {
        where: {
          userId: body.userId,
        },
        order: ['date DESC'],
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    // // console.log('data', data);
    // // const set = new Set(data);
    // // const data1 = [...set];
    // // console.log('data1', data1);
    // // return data1;
    // console.log('data', data);
    // // let notifications: any = data[0];

    // data.map((res: any) => {
    //   if (list.length === 0) {
    //     console.log('hello');
    //     list.push(res);
    //   } else {
    //     list.map((res1: any) => {
    //       console.log(res1.placeId, 'testing', res.placeId);
    //       if (res1.placeId === res.placeId) {
    //         console.log('data exists');
    //       } else {
    //         list.push(res);
    //       }
    //     });
    //   }
    // });
    if (data.length !== 0) {
      return data;
    } else {
      return [];
    }
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

  @get('/notificationslist/{travelPreferenceId}', {
    responses: {
      '200': {
        description: 'Notifications model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Notifications)},
        },
      },
    },
  })
  async findBytravelId(
    @param.path.string('travelPreferenceId') travelPreferenceId: string,
  ): Promise<any> {
    const data: any = await this.notificationsRepository.find(
      {
        where: {
          travelPreferenceId: travelPreferenceId,
        },
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    return {
      data: data,
    };
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

  @del('/delete', {
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
  async delete(@requestBody() body: any): Promise<any> {
    return this.notificationsRepository.deleteAll({
      userId: body.userid,
    });
  }
}
