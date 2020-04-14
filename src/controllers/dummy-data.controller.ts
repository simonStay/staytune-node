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
import {DummyData} from '../models';
import {DummyDataRepository} from '../repositories';

export class DummyDataController {
  constructor(
    @repository(DummyDataRepository)
    public dummyDataRepository : DummyDataRepository,
  ) {}

  @post('/dummy-data', {
    responses: {
      '200': {
        description: 'DummyData model instance',
        content: {'application/json': {schema: getModelSchemaRef(DummyData)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DummyData, {
            title: 'NewDummyData',
            exclude: ['id'],
          }),
        },
      },
    })
    dummyData: Omit<DummyData, 'id'>,
  ): Promise<DummyData> {
    return this.dummyDataRepository.create(dummyData);
  }

  @get('/dummy-data/count', {
    responses: {
      '200': {
        description: 'DummyData model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(DummyData)) where?: Where<DummyData>,
  ): Promise<Count> {
    return this.dummyDataRepository.count(where);
  }

  @get('/dummy-data', {
    responses: {
      '200': {
        description: 'Array of DummyData model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DummyData, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(DummyData)) filter?: Filter<DummyData>,
  ): Promise<DummyData[]> {
    return this.dummyDataRepository.find(filter);
  }

  @patch('/dummy-data', {
    responses: {
      '200': {
        description: 'DummyData PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DummyData, {partial: true}),
        },
      },
    })
    dummyData: DummyData,
    @param.query.object('where', getWhereSchemaFor(DummyData)) where?: Where<DummyData>,
  ): Promise<Count> {
    return this.dummyDataRepository.updateAll(dummyData, where);
  }

  @get('/dummy-data/{id}', {
    responses: {
      '200': {
        description: 'DummyData model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DummyData, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(DummyData)) filter?: Filter<DummyData>
  ): Promise<DummyData> {
    return this.dummyDataRepository.findById(id, filter);
  }

  @patch('/dummy-data/{id}', {
    responses: {
      '204': {
        description: 'DummyData PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DummyData, {partial: true}),
        },
      },
    })
    dummyData: DummyData,
  ): Promise<void> {
    await this.dummyDataRepository.updateById(id, dummyData);
  }

  @put('/dummy-data/{id}', {
    responses: {
      '204': {
        description: 'DummyData PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() dummyData: DummyData,
  ): Promise<void> {
    await this.dummyDataRepository.replaceById(id, dummyData);
  }

  @del('/dummy-data/{id}', {
    responses: {
      '204': {
        description: 'DummyData DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dummyDataRepository.deleteById(id);
  }
}
