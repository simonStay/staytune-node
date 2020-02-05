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
  NotificationsRepository,
  UserRepository,
} from '../repositories';
import axios from 'axios';
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
    @repository(NotificationsRepository)
    public notificationsRepository: NotificationsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
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
    console.log('travelDate:', travelData.travelDate);

    const startDate = moment(travelData.travelDate).format();

    const a: any = moment(startDate).format();
    console.log('startdate:', startDate);
    console.log(' a :', a);
    const endDate = moment(startDate).add(travelData.daysCount, 'days');
    const dates: any = moment(endDate).format();
    console.log('end date : ', dates);
    travelData.endDate = dates;

    await this.travelPreferencesRepository.updateById(
      travelData.id,
      travelData,
    );

    let finalList: Array<string> = [];

    const selectedData = travelPreferences.selectedTravelPreferences;

    let j: any;

    for (j = 0; j < selectedData.length; j++) {
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
    }

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
    const oldSelectedData: any = await travelData.selectedTravelPreferences;
    const newSelectedData: any = travelPreferences.selectedTravelPreferences;
    if (oldSelectedData) {
      //console.log('data values : ', oldSelectedData);
      let j: any;
      for (j = 0; j < oldSelectedData.length; j++) {
        // console.log('selected pt : ', oldSelectedData[j].name);

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
    }

    if (newSelectedData) {
      let k: any;
      for (k = 0; k < newSelectedData.length; k++) {
        if (newSelectedData[k].selected === true) {
          const preferenceCategoriesData = await this.travelPreferenceTypesRepository.find(
            {
              where: {name: newSelectedData[k].name},
            },
          );
          let categories = preferenceCategoriesData[0].categories;
          console.log('surya categories : ', categories);
          if (categories) {
            newPreferencesTypes = newPreferencesTypes.concat(categories);
          }
        }
      }
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

    const startDate = moment(travelPreferences.travelDate).format();
    // const a: any = moment(startDate, 'DD-MM-YYYY');
    const a: any = moment(startDate).format();
    console.log('startdate:', startDate);
    console.log(' a :', a);
    const endDate = moment(startDate).add(travelPreferences.daysCount, 'days');
    const dates: any = moment(endDate).format();
    console.log('end date : ', dates);
    // travelData.endDate = dates;

    travelPreferences.endDate = dates;

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
    let listCategories: Array<object> = [];
    let budgetPerDay: any;
    let result: any = [];
    let finalResult: Array<object> = [];
    let response: Array<object> = [];
    let finalType: any = [];
    await this.travelPreferencesRepository.updateById(id, travelPreferences);
    const updatedData = await this.travelPreferencesRepository.findById(id);
    //console.log(updatedData, 'updateddata');
    // console.log(updatedUser, 'userupdated');
    //console.log('Travel Preference Data : ', updatedData);
    const userData = await this.userRepository.findById(updatedData.userId);
    console.log('User Data : ', userData);
    console.log('device id : ', userData.deviceId);
    console.log('Selected Categories : ', updatedData.selectedCategories);
    if (updatedData.selectedCategories !== null) {
      updatedData.selectedCategories.map((categories: any) => {
        categories.subCategories.map((subCategory: any) => {
          if (subCategory.selected === true) {
            if (!listCategories.includes(subCategory.categoryname)) {
              listCategories = listCategories.concat(subCategory.categoryname);
            }
          }
        });
      });
    }
    console.log('Total Budget : ', updatedData.totalBudget);
    console.log('Days Count : ', updatedData.daysCount);
    if (updatedData.totalBudget && updatedData.daysCount) {
      budgetPerDay = updatedData.totalBudget / updatedData.daysCount;
      console.log('Budget per Day : ', budgetPerDay);
    } else {
      budgetPerDay = 0;
    }

    // const locationData = {
    //   lat: userData.lat,
    //   long: userData.long,
    // };

    // listCategories = await listCategories.slice(0, 1);

    // listCategories.map(async (type: any) => {
    //   console.log('Category Name : ', type);
    //   const placeType: any = await this.categoriesRepository.find({
    //     where: {categoryname: type},
    //   });

    //   result = await this.getTypes(placeType[0].googleCategory, locationData);

    //   if (result.length !== 0) {
    //     if (budgetPerDay !== 0) {
    //       if (budgetPerDay >= 100) {
    //         finalResult = [];
    //         result.map((rating: any) => {
    //           if (rating.rating >= 3) {
    //             console.log('shop name : ', rating.name);

    //             finalResult = finalResult.concat(rating);
    //           }
    //         });
    //       } else if (budgetPerDay < 100 && budgetPerDay >= 50) {
    //         finalResult = [];
    //         result.map((rating: any) => {
    //           if (rating.rating >= 2 && rating.rating < 3) {
    //             console.log('Budget between 50 and 100 : ', rating.name);

    //             finalResult = finalResult.concat(rating);
    //           }
    //         });
    //       } else if (budgetPerDay < 50) {
    //         finalResult = [];
    //         result.map((rating: any) => {
    //           if (rating.rating < 2) {
    //             console.log('Budget below 50 $ : ', rating.name);

    //             finalResult = finalResult.concat(rating);
    //           }
    //         });
    //       } else {
    //         console.log('error');
    //       }
    //     } else {
    //       finalResult = [];
    //       result.map((rating: any) => {
    //         if (rating.rating < 5) {
    //           console.log('No Budget : ', rating.name);

    //           finalResult = finalResult.concat(rating);
    //         }
    //       });
    //     }
    //     finalResult = await finalResult.slice(0, 4);

    //     finalResult.map(async (type1: any) => {
    //       finalType = finalType.concat(type1.name);
    //     });
    //     console.log('finaltYPE', finalType);
    //     const data = {
    //       id: userData.deviceId,
    //     };
    //     await this.notifications(data, finalType, placeType[0].googleCategory);
    //   }

    //   // eslint-disable-next-line require-atomic-updates
    //   // eslint-disable-next-line @typescript-eslint/await-thenable
    //   console.log('Final Result : ', finalResult);
    //   response = await response.concat(finalResult);
    // });

    // setTimeout(() => {
    //   console.log('Notifications Response : ', response);
    //   console.log('id', id);

    //   response.map((res: any) => {
    //     // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //     this.notificationsRepository.create({
    //       date: Date.now(),
    //       notification:
    //         'Hello' +
    //         ' ' +
    //         userData.firstname +
    //         ' ' +
    //         userData.lastname +
    //         ',' +
    //         'These are some of the famous places near you' +
    //         ' ' +
    //         ' ' +
    //         res.name,
    //       placeId: res.place_id,
    //       userId: userData.id,
    //       lat: res.geometry.location.lat,
    //       long: res.geometry.location.lng,
    //       icon: res.icon,
    //       name: res.name,
    //       travelPreferenceId: id,
    //     });
    //     console.log('lat : ', res.geometry.location.lat);
    //   });
    // }, 3000);

    return {
      status: 'success',
      message: 'successfully Updated',
      data: updatedData,
    };
  }

  @post('/travel-preferencesNotifications', {
    responses: {
      '204': {
        description: 'TravelPreferences PATCH success',
      },
    },
  })
  async notificationsList(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TravelPreferences, {partial: true}),
        },
      },
    })
    travelPreferences: any,
  ): Promise<void> {
    let listCategories: Array<object> = [];
    let budgetPerDay: any;
    let result: any = [];
    let finalResult: Array<object> = [];
    let response: Array<object> = [];
    let finalType: any = [];

    const updatedData = await this.travelPreferencesRepository.findById(
      travelPreferences.id,
    );

    const userData = await this.userRepository.findById(updatedData.userId);
    console.log('User Data : ', userData);
    console.log('device id : ', userData.deviceId);
    console.log('Selected Categories : ', updatedData.selectedCategories);
    if (updatedData.selectedCategories !== null) {
      updatedData.selectedCategories.map((categories: any) => {
        categories.subCategories.map((subCategory: any) => {
          if (subCategory.selected === true) {
            if (!listCategories.includes(subCategory.categoryname)) {
              listCategories = listCategories.concat(subCategory.categoryname);
            }
          }
        });
      });
    }
    console.log('Total Budget : ', updatedData.totalBudget);
    console.log('Days Count : ', updatedData.daysCount);
    if (updatedData.totalBudget && updatedData.daysCount) {
      budgetPerDay = updatedData.totalBudget / updatedData.daysCount;
      console.log('Budget per Day : ', budgetPerDay);
    } else {
      budgetPerDay = 0;
    }

    const locationData = {
      lat: userData.lat,
      long: userData.long,
    };

    listCategories = await listCategories.slice(0, 1);

    listCategories.map(async (type: any) => {
      console.log('Category Name : ', type);
      const placeType: any = await this.categoriesRepository.find({
        where: {categoryname: type},
      });

      result = await this.getTypes(placeType[0].googleCategory, locationData);

      if (result.length !== 0) {
        if (budgetPerDay !== 0) {
          if (budgetPerDay >= 100) {
            finalResult = [];
            result.map((rating: any) => {
              if (rating.rating >= 3) {
                console.log('shop name : ', rating.name);

                finalResult = finalResult.concat(rating);
              }
            });
          } else if (budgetPerDay < 100 && budgetPerDay >= 50) {
            finalResult = [];
            result.map((rating: any) => {
              if (rating.rating >= 2 && rating.rating < 3) {
                console.log('Budget between 50 and 100 : ', rating.name);

                finalResult = finalResult.concat(rating);
              }
            });
          } else if (budgetPerDay < 50) {
            finalResult = [];
            result.map((rating: any) => {
              if (rating.rating < 2) {
                console.log('Budget below 50 $ : ', rating.name);

                finalResult = finalResult.concat(rating);
              }
            });
          } else {
            console.log('error');
          }
        } else {
          finalResult = [];
          result.map((rating: any) => {
            if (rating.rating < 5) {
              console.log('No Budget : ', rating.name);

              finalResult = finalResult.concat(rating);
            }
          });
        }
        finalResult = await finalResult.slice(0, 4);

        finalResult.map(async (type1: any) => {
          finalType = finalType.concat(type1.name);
        });
        console.log('finaltYPE', finalType);
        const data = {
          id: userData.deviceId,
        };
        await this.notifications(data, finalType, placeType[0].googleCategory);
      }

      // eslint-disable-next-line require-atomic-updates
      // eslint-disable-next-line @typescript-eslint/await-thenable
      console.log('Final Result : ', finalResult);
      response = await response.concat(finalResult);
    });

    setTimeout(() => {
      console.log('Notifications Response : ', response);

      response.map((res: any) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.notificationsRepository.create({
          date: Date.now(),
          notification:
            'Hello' +
            ' ' +
            userData.firstname +
            ' ' +
            userData.lastname +
            ',' +
            'These are some of the famous places near you' +
            ' ' +
            ' ' +
            res.name,
          placeId: res.place_id,
          userId: userData.id,
          lat: res.geometry.location.lat,
          long: res.geometry.location.lng,
          icon: res.icon,
          name: res.name,
          travelPreferenceId: travelPreferences.id,
        });
        console.log('lat : ', res.geometry.location.lat);
      });
    }, 3000);
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
      // const startDate = moment().format(
      //   travelPreferenceData.travelDate,
      //   'DD-MM-YYYY',
      // );
      const startDate = moment(travelPreferenceData.travelDate).format();
      console.log(startDate, 'startdate');

      const currentDate = moment().format();
      console.log('current date', currentDate);
      // let a = moment(startDate, 'DD-MM-YYYY');
      // console.log('a', a);
      // let b = moment(currentDate, 'DD-MM-YYYY');
      // console.log('b', b);

      //   if (startDate) {
      //     // console.log('start date ', startDate);
      //     // console.log('current date ', currentDate);
      //     // daysCompleted = b.diff(a, 'days');
      //     // console.log('Completed days', daysCompleted);
      //     // let differenceInTime = currentDate.getTime() - startDate.getTime();
      //     // To calculate the no. of days between two dates
      //     // let days = differenceInTime / (1000 * 3600 * 24);
      //     // console.log('Completed days', days);
      //   }
      // }

      let response: Array<object> = [];

      const oldBudgetInfo = await this.budgetinfoRepository.find(
        {
          where: {travelId: body.id},
        },
        {
          strictObjectIDCoercion: true,
        },
      );
      console.log(oldBudgetInfo, 'budgetrepo');
      let expenditure = 0;
      if (oldBudgetInfo) {
        oldBudgetInfo.forEach(budget => {
          if (
            budget.mealsExpenditure !== undefined &&
            budget.entExpenditure !== undefined
          ) {
            let dayBudget = budget.mealsExpenditure + budget.entExpenditure;
            let startDate = moment(
              travelPreferenceData.travelDate,
              'DD-MM-YYYY',
            );
            let a = moment(startDate, 'DD-MM-YYYY');
            if (budget.day) {
              const nextDay = a.add(budget.day - 1, 'days');
              console.log(nextDay, 'next');

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
        let a = moment(startDate, 'DD-MM-YYYY');
        const nextDay = a.add(completedDays - 1, 'days');
        console.log(nextDay, 'next');

        const budgetPerDay = remaingBudget / daysLeft;
        const budgetDivide = budgetPerDay / 2;
        for (i = completedDays + 1; i <= daysCount; i++) {
          const dayNext = nextDay.add(1, 'days');
          // eslint-disable-next-line require-atomic-updates
          response = await response.concat({
            id: i,
            day: i,
            dayBudget: budgetPerDay,
            meals: budgetDivide,
            entertainment: budgetDivide,
            date: dayNext.format('DD-MM-YYYY'),
          });
        }
        console.log(response, 'dta123');
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
  public async notifications(data: any, text: any, parentCategory: any) {
    console.log('data information : ', data);

    const information: any = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      app_id: '8d39b7db-d029-4bbd-af58-20e3f53cc4a9',

      // eslint-disable-next-line @typescript-eslint/camelcase
      include_player_ids: [data.id],

      contents: {
        en:
          'These are the famous' +
          ' ' +
          parentCategory +
          ' ' +
          'near you' +
          ' ' +
          text,
      },
    };
    const details = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      information,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic NDA5YWNmM2UtODFhZi00MzMzLTg0OTItYTFiODg0OTA4Njlk',
        },
      },
    );
    console.log('details', details);

    // console.log(data, text, 'any');
  }

  public async getTypes(type: any, body: any) {
    let data: any = {};

    data = await axios.post(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
        body.lat +
        ',' +
        body.long +
        '&radius=1500&type=' +
        type +
        '&key=AIzaSyBI_ae3Hvrib8Bao3_WrhXLEHKuGj1J8pQ',
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    let finalResponse: any = [];
    //let result: any = [];
    //let response1 = await data.data.results.map((result: any) => result.name);
    // response1 = await response1.concat(data.data.results);
    finalResponse = await finalResponse.concat(data.data.results);
    // console.log(finalResponse, 'final');
    // console.log(data, 'datadad');

    return finalResponse;
  }
}
