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
} from '@loopback/rest';
import {TravelPreferenceTypes} from '../models';
import {TravelPreferenceTypesRepository} from '../repositories';
import {inject} from '@loopback/context';
const multer = require('multer');

export class TravelPreferencesTypesController {
  constructor(
    @repository(TravelPreferenceTypesRepository)
    public travelPreferenceTypesRepository: TravelPreferenceTypesRepository,
  ) {}

  @post('/travel-preference-types', {
    responses: {
      '200': {
        description: 'TravelPreferenceTypes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TravelPreferenceTypes),
          },
        },
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
    @param.query.object('where', getWhereSchemaFor(TravelPreferenceTypes))
    where?: Where<TravelPreferenceTypes>,
  ): Promise<Count> {
    return this.travelPreferenceTypesRepository.count(where);
  }

  @get('/travel-preference-types', {
    responses: {
      '200': {
        description: 'Array of TravelPreferenceTypes model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TravelPreferenceTypes),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TravelPreferenceTypes))
    filter?: Filter<TravelPreferenceTypes>,
  ): Promise<TravelPreferenceTypes[]> {
    return this.travelPreferenceTypesRepository.find(filter);
  }

  @post('/preferences-types/upload', {
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
        cb(null, 'images/travel-preferences');
      },
      filename: function(
        req: any,
        file: {fieldname: string},
        cb: (arg0: null, arg1: string) => void,
      ) {
        cb(null, file.fieldname + '-' + Date.now());
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
    @param.query.object('where', getWhereSchemaFor(TravelPreferenceTypes))
    where?: Where<TravelPreferenceTypes>,
  ): Promise<Count> {
    return this.travelPreferenceTypesRepository.updateAll(
      travelPreferenceTypes,
      where,
    );
  }

  @get('/travel-preference-types/{id}', {
    responses: {
      '200': {
        description: 'TravelPreferenceTypes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TravelPreferenceTypes),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<TravelPreferenceTypes> {
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
    await this.travelPreferenceTypesRepository.updateById(
      id,
      travelPreferenceTypes,
    );
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
    await this.travelPreferenceTypesRepository.replaceById(
      id,
      travelPreferenceTypes,
    );
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
