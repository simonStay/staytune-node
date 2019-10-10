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
import {Avathars} from '../models';
import {AvatharsRepository} from '../repositories';

export class AvatharsController {
  constructor(
    @repository(AvatharsRepository)
    public avatharsRepository : AvatharsRepository,
  ) {}

  @post('/avathars', {
    responses: {
      '200': {
        description: 'Avathars model instance',
        content: {'application/json': {schema: getModelSchemaRef(Avathars)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Avathars, {exclude: ['id']}),
        },
      },
    })
    avathars: Omit<Avathars, 'id'>,
  ): Promise<Avathars> {
    return this.avatharsRepository.create(avathars);
  }

  @get('/avathars/count', {
    responses: {
      '200': {
        description: 'Avathars model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Avathars)) where?: Where<Avathars>,
  ): Promise<Count> {
    return this.avatharsRepository.count(where);
  }

  @get('/avathars', {
    responses: {
      '200': {
        description: 'Array of Avathars model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Avathars)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Avathars)) filter?: Filter<Avathars>,
  ): Promise<Avathars[]> {
    return this.avatharsRepository.find(filter);
  }

  @patch('/avathars', {
    responses: {
      '200': {
        description: 'Avathars PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Avathars, {partial: true}),
        },
      },
    })
    avathars: Avathars,
    @param.query.object('where', getWhereSchemaFor(Avathars)) where?: Where<Avathars>,
  ): Promise<Count> {
    return this.avatharsRepository.updateAll(avathars, where);
  }

  @get('/avathars/{id}', {
    responses: {
      '200': {
        description: 'Avathars model instance',
        content: {'application/json': {schema: getModelSchemaRef(Avathars)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Avathars> {
    return this.avatharsRepository.findById(id);
  }

  @patch('/avathars/{id}', {
    responses: {
      '204': {
        description: 'Avathars PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Avathars, {partial: true}),
        },
      },
    })
    avathars: Avathars,
  ): Promise<void> {
    await this.avatharsRepository.updateById(id, avathars);
  }

  @put('/avathars/{id}', {
    responses: {
      '204': {
        description: 'Avathars PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() avathars: Avathars,
  ): Promise<void> {
    await this.avatharsRepository.replaceById(id, avathars);
  }

  @del('/avathars/{id}', {
    responses: {
      '204': {
        description: 'Avathars DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.avatharsRepository.deleteById(id);
  }
}
