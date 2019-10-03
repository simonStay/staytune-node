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
import {Categories} from '../models';
import {CategoriesRepository} from '../repositories';

export class CategoriesController {
  constructor(
    @repository(CategoriesRepository)
    public categoriesRepository : CategoriesRepository,
  ) {}

  @post('/categories', {
    responses: {
      '200': {
        description: 'Categories model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categories)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categories, {exclude: ['id']}),
        },
      },
    })
    categories: Omit<Categories, 'id'>,
  ): Promise<Categories> {
    return this.categoriesRepository.create(categories);
  }

  @get('/categories/count', {
    responses: {
      '200': {
        description: 'Categories model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Categories)) where?: Where<Categories>,
  ): Promise<Count> {
    return this.categoriesRepository.count(where);
  }

  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Categories model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Categories)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Categories)) filter?: Filter<Categories>,
  ): Promise<Categories[]> {
    return this.categoriesRepository.find(filter);
  }

  @patch('/categories', {
    responses: {
      '200': {
        description: 'Categories PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categories, {partial: true}),
        },
      },
    })
    categories: Categories,
    @param.query.object('where', getWhereSchemaFor(Categories)) where?: Where<Categories>,
  ): Promise<Count> {
    return this.categoriesRepository.updateAll(categories, where);
  }

  @get('/categories/{id}', {
    responses: {
      '200': {
        description: 'Categories model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categories)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Categories> {
    return this.categoriesRepository.findById(id);
  }

  @patch('/categories/{id}', {
    responses: {
      '204': {
        description: 'Categories PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categories, {partial: true}),
        },
      },
    })
    categories: Categories,
  ): Promise<void> {
    await this.categoriesRepository.updateById(id, categories);
  }

  @put('/categories/{id}', {
    responses: {
      '204': {
        description: 'Categories PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() categories: Categories,
  ): Promise<void> {
    await this.categoriesRepository.replaceById(id, categories);
  }

  @del('/categories/{id}', {
    responses: {
      '204': {
        description: 'Categories DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoriesRepository.deleteById(id);
  }
}
