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
import {TravelPreferenceTypes} from '../models';
import {TravelPreferenceTypesRepository} from '../repositories';

export class TravelPreferencesTypesController {
  constructor(
    @repository(TravelPreferenceTypesRepository)
    public travelPreferenceTypesRepository : TravelPreferenceTypesRepository,
  ) {}

  @post('/travel-preference-types', {
    responses: {
      '200': {
        description: 'TravelPreferenceTypes model instance',
        content: {'application/json': {schema: getModelSchemaRef(TravelPreferenceTypes)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferenceTypes, {exclude: ['id']}),
        },
      },
    })
    travelPreferenceTypes: Omit<TravelPreferenceTypes, 'id'>,
  ): Promise<TravelPreferenceTypes> {
    return this.travelPreferenceTypesRepository.create(travelPreferenceTypes);
  }

  @get('/travel-preference-types/count', {
    responses: {
      '200': {
        description: 'TravelPreferenceTypes model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TravelPreferenceTypes)) where?: Where<TravelPreferenceTypes>,
  ): Promise<Count> {
    return this.travelPreferenceTypesRepository.count(where);
  }

  @get('/travel-preference-types', {
    responses: {
      '200': {
        description: 'Array of TravelPreferenceTypes model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TravelPreferenceTypes)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TravelPreferenceTypes)) filter?: Filter<TravelPreferenceTypes>,
  ): Promise<TravelPreferenceTypes[]> {
    return this.travelPreferenceTypesRepository.find(filter);
  }

  @patch('/travel-preference-types', {
    responses: {
      '200': {
        description: 'TravelPreferenceTypes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferenceTypes, {partial: true}),
        },
      },
    })
    travelPreferenceTypes: TravelPreferenceTypes,
    @param.query.object('where', getWhereSchemaFor(TravelPreferenceTypes)) where?: Where<TravelPreferenceTypes>,
  ): Promise<Count> {
    return this.travelPreferenceTypesRepository.updateAll(travelPreferenceTypes, where);
  }

  @get('/travel-preference-types/{id}', {
    responses: {
      '200': {
        description: 'TravelPreferenceTypes model instance',
        content: {'application/json': {schema: getModelSchemaRef(TravelPreferenceTypes)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<TravelPreferenceTypes> {
    return this.travelPreferenceTypesRepository.findById(id);
  }

  @patch('/travel-preference-types/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferenceTypes PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferenceTypes, {partial: true}),
        },
      },
    })
    travelPreferenceTypes: TravelPreferenceTypes,
  ): Promise<void> {
    await this.travelPreferenceTypesRepository.updateById(id, travelPreferenceTypes);
  }

  @put('/travel-preference-types/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferenceTypes PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() travelPreferenceTypes: TravelPreferenceTypes,
  ): Promise<void> {
    await this.travelPreferenceTypesRepository.replaceById(id, travelPreferenceTypes);
  }

  @del('/travel-preference-types/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferenceTypes DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.travelPreferenceTypesRepository.deleteById(id);
  }
}
