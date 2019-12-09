/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
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
import {TravelPreferences, User} from '../models';
import {
  TravelPreferencesRepository,
  CategoriesRepository,
  BudgetInfoRepository,
  TravelPreferenceTypesRepository,
} from '../repositories';
let moment = require('moment');

export class TravelPreferencesController {
  constructor(
    @repository(TravelPreferencesRepository)
    public travelPreferencesRepository: TravelPreferencesRepository,
    @repository(CategoriesRepository)
    public categoriesRepository: CategoriesRepository,
    @repository(TravelPreferenceTypesRepository)
    public travelPreferenceTypesRepository: TravelPreferenceTypesRepository,
    @repository(BudgetInfoRepository)
    public budgetinfoRepository: BudgetInfoRepository,
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
    let finalList: Array<string> = [];
    // const Business: Array<string> = ['Culinary'];
    // const Foodie: Array<string> = ['Culinary'];
    // const Shopping: Array<string> = ['Shopping', 'Culinary'];
    // const allCategories: Array<string> = [
    //   'Shopping',
    //   'Culinary',
    //   'Adventure',
    //   'Museums',
    //   'Entertainment',
    // ];
    const selectedData = travelPreferences.selectedTravelPreferences;
    // console.log(selectedData);
    let j: any;
    // selectedData.map(async (dataPreference: any) => {
    for (j = 0; j < selectedData.length; j++) {
      // console.log('selected categories by surya', dataPreference);
      // console.log('testdfdfd', dataPreference.name);
      if (selectedData[j].selected === true) {
        const preferenceCategoriesData = await this.travelPreferenceTypesRepository.find(
          {
            where: {name: selectedData[j].name},
          },
        );
        let categories = preferenceCategoriesData[0].categories;
        console.log('surya categories : ', categories);
        if (categories) {
          finalList = finalList.concat(categories);
        }
      }

      // if (
      //   dataPreference.name === 'Business' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(Business);
      // }
      // if (
      //   dataPreference.name === 'Foodie' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(Foodie);
      // }
      // if (
      //   dataPreference.name === 'Shopping' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(Shopping);
      // }
      // if (
      //   dataPreference.name === 'Local Experience' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(allCategories);
      // }
      // if (
      //   dataPreference.name === 'Travel on a budget' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(allCategories);
      // }
      // if (
      //   dataPreference.name === 'Solo Traveler' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(allCategories);
      // }
      // if (
      //   dataPreference.name === 'Family-oriented trendy' &&
      //   dataPreference.selected === true
      // ) {
      //   console.log(dataPreference.name);
      //   finalList = finalList.concat(allCategories);
      // }
    }
    // });

    console.log('final list by surya today : ', finalList);

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
        // return {
        //   status: 'Success',
        // };
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
          'application/json': {schema: getModelSchemaRef(User)},
        },
      },
    },
  })
  async findByUserId(@requestBody() body: any): Promise<TravelPreferences[]> {
    const userId = body.userId;
    const listPreferences = await this.travelPreferencesRepository.find(
      {
        where: {userId: userId},
        order: ['id DESC'],
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    console.log(listPreferences);
    return listPreferences;
  }

  @post('/travel-preferences/update', {
    responses: {
      '200': {
        description: 'TravelPreferences model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TravelPreferences)},
        },
      },
    },
  })
  async edit(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences),
        },
      },
    })
    travelPreferences: TravelPreferences,
  ): Promise<any> {
    const travelData = await this.travelPreferencesRepository.findById(
      travelPreferences.id,
    );
    let tid = '';
    tid = travelData.id;
    let oldSelectedCategories = {};
    oldSelectedCategories = await travelData.selectedCategories;
    // console.log('New Data : ', travelPreferences.selectedTravelPreferences);
    // console.log('Old data : ', travelData.selectedTravelPreferences);
    const Business: Array<string> = ['Culinary'];
    const Foodie: Array<string> = ['Culinary'];
    const Shopping: Array<string> = ['Shopping', 'Culinary'];
    const allCategories: Array<string> = [
      'Shopping',
      'Culinary',
      'Adventure',
      'Museums',
      'Entertainment',
    ];
    let oldPreferencesTypes: Array<string> = [];
    let newPreferencesTypes: Array<string> = [];
    const oldSelectedData = await travelData.selectedTravelPreferences;
    const newSelectedData = travelPreferences.selectedTravelPreferences;
    if (oldSelectedData) {
      let j: any;
      for (j = 0; j < oldSelectedData.length; j++) {
        if (oldSelectedData[j].selected === true) {
          const preferenceCategoriesData = await this.travelPreferenceTypesRepository.find(
            {
              where: {name: oldSelectedData[j].name},
            },
          );
          let categories = preferenceCategoriesData[0].categories;
          console.log('surya categories : ', categories);
          if (categories) {
            oldPreferencesTypes = oldPreferencesTypes.concat(categories);
          }
        }
      }
      oldSelectedData.forEach((oldDataPreference: any) => {
        if (
          oldDataPreference.name === 'Business' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(Business);
        }
        if (
          oldDataPreference.name === 'Foodie' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(Foodie);
        }
        if (
          oldDataPreference.name === 'Shopping' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(Shopping);
        }
        if (
          oldDataPreference.name === 'Local Experience' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
        if (
          oldDataPreference.name === 'Travel on a budget' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
        if (
          oldDataPreference.name === 'Solo Traveler' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
        if (
          oldDataPreference.name === 'Family-oriented trendy' &&
          oldDataPreference.selected === true
        ) {
          oldPreferencesTypes = oldPreferencesTypes.concat(allCategories);
        }
      });
    }

    if (newSelectedData) {
      newSelectedData.forEach((newDataPreference: any) => {
        if (
          newDataPreference.name === 'Business' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(Business);
        }
        if (
          newDataPreference.name === 'Foodie' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(Foodie);
        }
        if (
          newDataPreference.name === 'Shopping' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(Shopping);
        }
        if (
          newDataPreference.name === 'Local Experience' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
        if (
          newDataPreference.name === 'Travel on a budget' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
        if (
          newDataPreference.name === 'Solo Traveler' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
        if (
          newDataPreference.name === 'Family-oriented trendy' &&
          newDataPreference.selected === true
        ) {
          newPreferencesTypes = newPreferencesTypes.concat(allCategories);
        }
      });
    }

    console.log('New Data : ', newPreferencesTypes);
    console.log('Old data : ', oldPreferencesTypes);
    let finalList: Array<string> = [];
    let oldList: Array<string> = [];
    newPreferencesTypes.forEach((item: string) => {
      if (oldPreferencesTypes.includes(item)) {
        console.log('Old List : ', item);
        oldList = oldList.concat(item);
      } else {
        console.log('New list : ', item);
        finalList = finalList.concat(item);
      }
    });

    await this.travelPreferencesRepository.updateById(
      travelPreferences.id,
      travelPreferences,
    );

    console.log(finalList);
    console.log(oldList);
    let categoriesList: Array<object> = [];
    if (oldList) {
      categoriesList = categoriesList.concat(oldSelectedCategories);
    }
    if (JSON.stringify(finalList) === JSON.stringify([])) {
      console.log('Only old data : ', categoriesList);
      return {
        status: 'Success',
        id: tid,
        categoriesList,
      };
    } else if (finalList) {
      const mainCategories = await this.categoriesRepository.find({
        where: {categoryname: {inq: finalList}},
      });

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
          console.log(categoriesList, 'category');
          return {
            status: 'Success',
            id: tid,
            categoriesList,
          };
          // return {
          //   status: 'Success',
          // };
        }
      }
    }
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

  @post('/budget-info', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async budgetInfo(@requestBody() body: any): Promise<any> {
    const travelPreferenceData = await this.travelPreferencesRepository.findById(
      body.id,
    );
    // const budgetPerDay = data.totalBudget / data.daysCount;
    let daysCompleted = 0;
    if (travelPreferenceData.travelDate) {
      console.log(travelPreferenceData.travelDate);
      const startDate = moment().format(
        travelPreferenceData.travelDate,
        'DD-MM-YYYY',
      );

      const currentDate = moment().format('DD-MM-YYYY');
      let a = moment(startDate, 'DD-MM-YYYY');
      let b = moment(currentDate, 'DD-MM-YYYY');

      if (startDate) {
        console.log('start date ', startDate);
        console.log('current date ', currentDate);

        daysCompleted = b.diff(a, 'days');
        console.log('Completed days', daysCompleted);
        // let differenceInTime = currentDate.getTime() - startDate.getTime();
        // To calculate the no. of days between two dates
        // let days = differenceInTime / (1000 * 3600 * 24);
        // console.log('Completed days', days);
      }
    }

    let response: Array<object> = [];

    const oldBudgetInfo = await this.budgetinfoRepository.find(
      {
        where: {travelId: body.id},
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    console.log(oldBudgetInfo);
    let expenditure = 0;
    if (oldBudgetInfo) {
      oldBudgetInfo.forEach(budget => {
        if (budget.mealsExpenditure && budget.entExpenditure) {
          let dayBudget = budget.mealsExpenditure + budget.entExpenditure;
          const startDate = moment().format(
            travelPreferenceData.travelDate,
            'DD-MM-YYYY',
          );
          let a = moment(startDate, 'DD-MM-YYYY');
          if (budget.day) {
            const nextDay = a.add(budget.day - 1, 'days');

            response.push({
              id: budget.day,
              day: budget.day,
              dayBudget: dayBudget,
              meals: budget.mealsExpenditure,
              entertainment: budget.entExpenditure,
              date: nextDay.format('DD-MM-YYYY'),
            });
          }
          expenditure = expenditure + dayBudget;
        }
      });

      // response = response.concat(oldBudgetInfo);
    }
    console.log(response);

    let totalBudget: any;
    let daysCount: any;
    let totalExpen: any;
    let i: any;
    let daysLeft: any;

    const completedDays = oldBudgetInfo.length;
    totalBudget = travelPreferenceData.totalBudget;
    totalExpen = expenditure;
    const remaingBudget = totalBudget - totalExpen;
    daysCount = travelPreferenceData.daysCount;
    daysLeft = daysCount - completedDays;
    console.log(daysLeft, 'daysleft');
    console.log(completedDays, 'days');
    if (daysLeft !== 0) {
      let startDate = moment(travelPreferenceData.travelDate, 'DD-MM-YYYY');
      const nextDay = startDate.add(completedDays - 1, 'days');
      console.log(nextDay, 'next');

      const budgetPerDay = remaingBudget / daysLeft;
      const budgetDivide = budgetPerDay / 2;
      for (i = completedDays + 1; i <= daysCount; i++) {
        const dayNext = nextDay.add(1, 'days');
        await response.push({
          id: i,
          day: i,
          dayBudget: budgetPerDay,
          meals: budgetDivide,
          entertainment: budgetDivide,
          date: dayNext.format('DD-MM-YYYY'),
        });
      }
      console.log(response, 'dta');
      return {
        budget: response,
        totalBudget: travelPreferenceData.totalBudget,
        expBudget: expenditure,
        completedDays: daysCompleted,
      };
    }
    return {
      budget: response,
      totalBudget: travelPreferenceData.totalBudget,
      expBudget: expenditure,
      completedDays: daysCompleted,
    };
  }
}
