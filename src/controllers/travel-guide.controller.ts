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
  RestBindings,
  Response,
  Request,
} from '@loopback/rest';
import {TravelGuide} from '../models';
import {TravelGuideRepository} from '../repositories';
import {inject} from '@loopback/context';
const multer = require('multer');

export class TravelGuideController {
  constructor(
    @repository(TravelGuideRepository)
    public travelGuideRepository: TravelGuideRepository,
  ) {}

  @post('/travel-guides', {
    responses: {
      '200': {
        description: 'TravelGuide model instance',
        content: {'application/json': {schema: getModelSchemaRef(TravelGuide)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelGuide, {exclude: ['id']}),
        },
      },
    })
    travelGuide: Omit<TravelGuide, 'id'>,
  ): Promise<TravelGuide> {
    return this.travelGuideRepository.create(travelGuide);
  }

  @get('/travel-guides/count', {
    responses: {
      '200': {
        description: 'TravelGuide model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TravelGuide))
    where?: Where<TravelGuide>,
  ): Promise<Count> {
    return this.travelGuideRepository.count(where);
  }

  @post('/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  async uploadFile(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: any,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Object> {
    const storage = multer.diskStorage({
      destination: function(
        req: any,
        file: any,
        cb: (arg0: null, arg1: string) => void,
      ) {
        cb(null, 'images/tour-guides');
      },
      filename: function(
        req: any,
        file: {fieldname: string; originalname: string},
        cb: (arg0: null, arg1: string) => void,
      ) {
        cb(null, file.originalname);
      },
    });

    const upload = multer({storage: storage});
    return new Promise<object>((resolve, reject) => {
      upload.any()(request, response, (err: string) => {
        if (err) return err;
        resolve({
          files: request.files,
          fields: (request as any).fields,
        });
      });
    });
  }

  @get('/travel-guides', {
    responses: {
      '200': {
        description: 'Array of TravelGuide model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TravelGuide)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TravelGuide))
    filter?: Filter<TravelGuide>,
  ): Promise<TravelGuide[]> {
    return this.travelGuideRepository.find(filter);
  }

  @patch('/travel-guides', {
    responses: {
      '200': {
        description: 'TravelGuide PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelGuide, {partial: true}),
        },
      },
    })
    travelGuide: TravelGuide,
    @param.query.object('where', getWhereSchemaFor(TravelGuide))
    where?: Where<TravelGuide>,
  ): Promise<Count> {
    return this.travelGuideRepository.updateAll(travelGuide, where);
  }

  @get('/travel-guides/{id}', {
    responses: {
      '200': {
        description: 'TravelGuide model instance',
        content: {'application/json': {schema: getModelSchemaRef(TravelGuide)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<TravelGuide> {
    return this.travelGuideRepository.findById(id);
  }

  @patch('/travel-guides/{id}', {
    responses: {
      '204': {
        description: 'TravelGuide PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelGuide, {partial: true}),
        },
      },
    })
    travelGuide: TravelGuide,
  ): Promise<void> {
    await this.travelGuideRepository.updateById(id, travelGuide);
  }

  @put('/travel-guides/{id}', {
    responses: {
      '204': {
        description: 'TravelGuide PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() travelGuide: TravelGuide,
  ): Promise<void> {
    await this.travelGuideRepository.replaceById(id, travelGuide);
  }

  @del('/travel-guides/{id}', {
    responses: {
      '204': {
        description: 'TravelGuide DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.travelGuideRepository.deleteById(id);
  }
}
