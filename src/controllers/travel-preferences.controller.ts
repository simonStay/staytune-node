/* eslint-disable @typescript-eslint/await-thenable */
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
import {TravelPreferences, Categories, User} from '../models';
import {
  TravelPreferencesRepository,
  CategoriesRepository,
} from '../repositories';
import {threadId} from 'worker_threads';

export class TravelPreferencesController {
  constructor(
    @repository(TravelPreferencesRepository)
    public travelPreferencesRepository: TravelPreferencesRepository,
    @repository(CategoriesRepository)
    public categoriesRepository: CategoriesRepository,
  ) {}

  @post('/travel-preferences', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {exclude: ['id']}),
        },
      },
    })
    travelPreferences: Omit<TravelPreferences, 'id'>,
  ): Promise<any> {
    const travelData = await this.travelPreferencesRepository.create(
      travelPreferences,
    );
    let tid = '';
    tid = travelData.id;
    console.log('test1', travelData.id);
    travelData.userCheck = '1' + travelData.userId;
    await this.travelPreferencesRepository.updateById(
      travelData.id,
      travelData,
    );
    console.log(travelPreferences.selectedTravelPreferences);
    let finalList: Array<string> = [];
    const Business: Array<string> = ['Culinary'];
    const Vegan: Array<string> = ['Culinary'];
    const Shopping: Array<string> = ['Shopping', 'Culinary'];
    const allCategories: Array<string> = [
      'Shopping',
      'Culinary',
      'Adventure',
      'Museums',
      'Entertainment',
    ];
    if (travelPreferences.selectedTravelPreferences.includes('Business')) {
      finalList = finalList.concat(Business);
    }
    if (travelPreferences.selectedTravelPreferences.includes('Vegan')) {
      finalList = finalList.concat(Vegan);
    }
    if (travelPreferences.selectedTravelPreferences.includes('Shopping')) {
      finalList = finalList.concat(Shopping);
    }
    if (
      travelPreferences.selectedTravelPreferences.includes('Local Experience')
    ) {
      finalList = finalList.concat(allCategories);
    }
    if (
      travelPreferences.selectedTravelPreferences.includes('Travel on a budget')
    ) {
      finalList = finalList.concat(allCategories);
    }
    if (travelPreferences.selectedTravelPreferences.includes('Solo Traveler')) {
      finalList = finalList.concat(allCategories);
    }
    if (
      travelPreferences.selectedTravelPreferences.includes(
        'Family-oriented trendy',
      )
    ) {
      finalList = finalList.concat(allCategories);
    }

    console.log(finalList);

    const mainCategories = await this.categoriesRepository.find({
      where: {categoryname: {inq: finalList}},
    });

    const categoriesList: Array<object> = [];
    let i: any;
    for (i = 0; i < mainCategories.length; i++) {
      const subCategories = await this.categoriesRepository.find({
        where: {parentcategory: mainCategories[i].categoryname},
      });
      // console.log(subCategories, 'sub');
      categoriesList.push({
        id: mainCategories[i].id,
        categoryname: mainCategories[i].categoryname,
        subCategories: subCategories,
      });

      if (i === mainCategories.length - 1) {
        console.log('test2', tid);
        return {
          status: 'Success',
          id: tid,
          categoriesList,
        };
      }
    }
  }

  @get('/travel-preferences/count', {
    responses: {
      '200': {
        description: 'TravelPreferences model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TravelPreferences))
    where?: Where<TravelPreferences>,
  ): Promise<Count> {
    return this.travelPreferencesRepository.count(where);
  }

  @get('/travel-preferences', {
    responses: {
      '200': {
        description: 'Array of TravelPreferences model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TravelPreferences),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TravelPreferences))
    filter?: Filter<TravelPreferences>,
  ): Promise<TravelPreferences[]> {
    return this.travelPreferencesRepository.find(filter);
  }

  @post('/travel-preferences/userId', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async findByUserId(@requestBody() body: any): Promise<object> {
    const userId = '1' + body.userId;
    const listPreferences = await this.travelPreferencesRepository.find({
      where: {userCheck: userId},
    });
    console.log(listPreferences);
    return listPreferences;
  }

  @patch('/travel-preferences', {
    responses: {
      '200': {
        description: 'TravelPreferences PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {partial: true}),
        },
      },
    })
    travelPreferences: TravelPreferences,
    @param.query.object('where', getWhereSchemaFor(TravelPreferences))
    where?: Where<TravelPreferences>,
  ): Promise<Count> {
    return this.travelPreferencesRepository.updateAll(travelPreferences, where);
  }

  @get('/travel-preferences/{id}', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<TravelPreferences> {
    return this.travelPreferencesRepository.findById(id);
  }

  @patch('/travel-preferences/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferences PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {partial: true}),
        },
      },
    })
    travelPreferences: TravelPreferences,
  ): Promise<object> {
    await this.travelPreferencesRepository.updateById(id, travelPreferences);
    const updatedData = await this.travelPreferencesRepository.findById(id);
    // console.log(checkUser, '5d9ab8211113661189ffb735');
    console.log(updatedData, 'updateddata');
    // console.log(updatedUser, 'userupdated');

    return {
      status: 'success',
      message: 'successfully Updated',
      data: updatedData,
    };
  }

  @put('/travel-preferences/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferences PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() travelPreferences: TravelPreferences,
  ): Promise<void> {
    await this.travelPreferencesRepository.replaceById(id, travelPreferences);
  }

  @del('/travel-preferences/{id}', {
    responses: {
      '204': {
        description: 'TravelPreferences DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.travelPreferencesRepository.deleteById(id);
  }

  // @post('/user/travel-preferences/', {
  //   responses: {
  //     '200': {
  //       description: 'Array of Admin model instances',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //     },
  //   },
  // })
  // async movies(@requestBody() body: any): Promise<object> {
  //   // const value = data;
  //   const uid = body.userId;
  //   console.log('uid', uid);
  //   return uid;
  // }
}
