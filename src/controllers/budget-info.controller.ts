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
import {BudgetInfo, TravelPreferences} from '../models';
import {
  BudgetInfoRepository,
  TravelPreferencesRepository,
} from '../repositories';

export class BudgetInfoController {
  constructor(
    @repository(BudgetInfoRepository)
    public budgetInfoRepository: BudgetInfoRepository,
    @repository(TravelPreferencesRepository)
    public travelPreferencesRepository: TravelPreferencesRepository,
  ) {}

  @post('/budget-infos', {
    responses: {
      '200': {
        description: 'BudgetInfo model instance',
        content: {'application/json': {schema: getModelSchemaRef(BudgetInfo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BudgetInfo, {exclude: ['id']}),
        },
      },
    })
    budgetInfo: Omit<BudgetInfo, 'id'>,
  ): Promise<BudgetInfo> {
    return this.budgetInfoRepository.create(budgetInfo);
  }

  @get('/budget-infos/count', {
    responses: {
      '200': {
        description: 'BudgetInfo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(BudgetInfo))
    where?: Where<BudgetInfo>,
  ): Promise<Count> {
    return this.budgetInfoRepository.count(where);
  }

  @get('/budget-infos', {
    responses: {
      '200': {
        description: 'Array of BudgetInfo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BudgetInfo)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(BudgetInfo))
    filter?: Filter<BudgetInfo>,
  ): Promise<BudgetInfo[]> {
    return this.budgetInfoRepository.find(filter);
  }

  @patch('/budget-infos', {
    responses: {
      '200': {
        description: 'BudgetInfo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BudgetInfo, {partial: true}),
        },
      },
    })
    budgetInfo: BudgetInfo,
    @param.query.object('where', getWhereSchemaFor(BudgetInfo))
    where?: Where<BudgetInfo>,
  ): Promise<Count> {
    return this.budgetInfoRepository.updateAll(budgetInfo, where);
  }

  @get('/budget-infos/{id}', {
    responses: {
      '200': {
        description: 'BudgetInfo model instance',
        content: {'application/json': {schema: getModelSchemaRef(BudgetInfo)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<BudgetInfo> {
    return this.budgetInfoRepository.findById(id);
  }

  @patch('/budget-infos/{id}', {
    responses: {
      '204': {
        description: 'BudgetInfo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BudgetInfo, {partial: true}),
        },
      },
    })
    budgetInfo: BudgetInfo,
  ): Promise<void> {
    await this.budgetInfoRepository.updateById(id, budgetInfo);
  }

  @put('/budget-infos/{id}', {
    responses: {
      '204': {
        description: 'BudgetInfo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() budgetInfo: BudgetInfo,
  ): Promise<void> {
    await this.budgetInfoRepository.replaceById(id, budgetInfo);
  }

  @del('/budget-infos/{id}', {
    responses: {
      '204': {
        description: 'BudgetInfo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.budgetInfoRepository.deleteById(id);
  }
}
