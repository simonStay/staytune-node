import {
  Count,
  CountSchema,
  Filter,
  // FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Aws} from '../models';
import {AwsRepository} from '../repositories';

export class AwsController {
  constructor(
    @repository(AwsRepository)
    public awsRepository: AwsRepository,
  ) {}

  @post('/aws', {
    responses: {
      '200': {
        description: 'Aws model instance',
        content: {'application/json': {schema: getModelSchemaRef(Aws)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Aws, {
            title: 'NewAws',
          }),
        },
      },
    })
    aws: Aws,
  ): Promise<Aws> {
    return this.awsRepository.create(aws);
  }

  // @get('/aws/count', {
  //   responses: {
  //     '200': {
  //       description: 'Aws model count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async count(@param.where(Aws) where?: Where<Aws>): Promise<Count> {
  //   return this.awsRepository.count(where);
  // }

  @get('/aws', {
    responses: {
      '200': {
        description: 'Array of Aws model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Aws, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(): Promise<any> {
    return this.awsRepository.find();
  }

  // @patch('/aws', {
  //   responses: {
  //     '200': {
  //       description: 'Aws PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Aws, {partial: true}),
  //       },
  //     },
  //   })
  //   aws: Aws,
  //   @param.where(Aws) where?: Where<Aws>,
  // ): Promise<Count> {
  //   return this.awsRepository.updateAll(aws, where);
  // }

  // @get('/aws/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'Aws model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(Aws, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(Aws, {exclude: 'where'}) filter?: FilterExcludingWhere<Aws>,
  // ): Promise<Aws> {
  //   return this.awsRepository.findById(id, filter);
  // }

  @patch('/aws/{id}', {
    responses: {
      '204': {
        description: 'Aws PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Aws, {partial: true}),
        },
      },
    })
    aws: Aws,
  ): Promise<void> {
    await this.awsRepository.updateById(id, aws);
  }

  @put('/aws/{id}', {
    responses: {
      '204': {
        description: 'Aws PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() aws: Aws,
  ): Promise<void> {
    await this.awsRepository.replaceById(id, aws);
  }

  @del('/aws/{id}', {
    responses: {
      '204': {
        description: 'Aws DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.awsRepository.deleteById(id);
  }
}
