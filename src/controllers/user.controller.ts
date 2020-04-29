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
import {inject} from '@loopback/core';
import {User} from '../models';
import {
  UserRepository,
  NotificationsRepository,
  CategoriesRepository,
  TravelPreferencesRepository,
  DummyDataRepository,
} from '../repositories';

import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from './specs/user-controller-specs';
import {Credentials} from '../repositories/user.repository';
import {TokenServiceBindings, UserServiceBindings} from '../keys';
import * as nodemailer from 'nodemailer';
const cron = require('node-cron');
const moment = require('moment');
const fs = require('fs');
const express = require('express');
const app = express();
//const CircularJSON = require('circular-json');

import axios from 'axios';
import {type} from 'os';
import _ = require('lodash');
// import {CategoriesController} from './categories.controller';
// import {json} from 'express';

const crypto = require('crypto');

// import JSON from 'circular-json';
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'staytune.node@gmail.com',
    pass: 'nuevesol@9',
  },
});

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(TravelPreferencesRepository)
    public travelPreferenceRepository: TravelPreferencesRepository,
    @repository(NotificationsRepository)
    public notificationsRepository: NotificationsRepository,
    @repository(CategoriesRepository)
    public categoriesRepository: CategoriesRepository,
    @repository(DummyDataRepository)
    public dummyDataRepository: DummyDataRepository,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {exclude: ['id']}),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<object> {
    const email: any = user.email.toLowerCase();
    user.email = email;
    console.log('email', email);
    console.log('useremail', user.email);
    const extUser = await this.userRepository.findOne({
      where: {email: email},
    });
    if (extUser) {
      return {
        message: 'User already exists, Please login',
        status: 'failed',
      };
    } else {
      const link =
        'https://staytune.austinconversionoptimization.com/email-verification/?email=' +
        user.email;
      const id = Math.random() * 10000;
      const otp = Math.floor(id);
      const mailOptions = {
        from: 'info@staytune.com',
        to: email,
        subject: 'Email Verification from Staytune',
        html:
          'Hello ' +
          user.firstname +
          ' ' +
          user.lastname +
          ', The otp to verify your email address is ' +
          otp +
          '<br>',
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ');
        }
      });

      const mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let mystr = mykey.update(user.password, 'utf8', 'hex');
      mystr = mystr + mykey.final('hex');

      // eslint-disable-next-line require-atomic-updates
      user.password = mystr;

      const newUser = await this.userRepository.create(user);
      console.log('user/create');
      console.log('**********');
      console.log('new User', newUser);
      return {
        id: newUser.id,
        message: 'User has been registered successfully ',
        status: 'success',
        otp: otp,
      };
    }
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  // @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<object> {
    if (user.password) {
      const mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let mystr = mykey.update(user.password, 'utf8', 'hex');
      mystr = mystr + mykey.final('hex');

      // eslint-disable-next-line require-atomic-updates
      user.password = mystr;
      await this.userRepository.updateById(id, user);
    } else {
      await this.userRepository.updateById(id, user);
    }

    const updatedData = await this.userRepository.findById(id);
    // console.log(checkUser, '5d9ab8211113661189ffb735');

    console.log('patch/users/id');

    console.log('***********');

    // console.log(updatedUser, 'userupdated');
    console.log('updated user', updatedData);

    return {
      status: 'success',
      message: 'successfully Updated',
      data: updatedData,
    };
  }

  // @patch('/usersValidation/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'User PATCH success',
  //     },
  //   },
  // })
  // async updateByIdValidation(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(User, {partial: true}),
  //       },
  //     },
  //   })
  //   user: User,
  // ): Promise<object> {
  //   await this.userRepository.updateById(id, user);

  //   const updatedData = await this.userRepository.findById(id);
  //   // console.log(checkUser, '5d9ab8211113661189ffb735');

  //   // console.log(updatedUser, 'userupdated');

  //   return {
  //     status: 'success',
  //     message: 'successfully Updated',
  //     data: updatedData,
  //   };
  // }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @post('/users/{email}/', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async update(@param.path.string('email') email: string): Promise<object> {
    const User1 = await this.userRepository.findOne({where: {email: email}});
    let Id: string;
    if (User1 !== null) {
      Id = User1.id;

      User1.verified = true;
      await this.userRepository.updateById(Id, User1);
      return {
        data: User1.verified,
      };
    }
    return {
      data: 'false',
    };
  }

  @post('/user/forgot-password', {
    responses: {
      '200': {
        description: 'Forgot User Password',
        content: {'application/json': {schema: {'x-ts-type': User}}},
      },
    },
  })
  async forgotPassword(@requestBody() body: User): Promise<object> {
    const email: any = body.email.toLowerCase();

    console.log('post/user/forgot-password');
    console.log('***********');
    console.log(email, 'email');
    const user = await this.userRepository.findOne({
      where: {email: email},
    });
    if (user != null) {
      const id = Math.random() * 10000;
      const otp = Math.floor(id);
      console.log('otp', otp);

      const mailOptions = {
        from: 'info@staytune.com',
        to: email,
        subject: 'Email Verification from Staytune',
        html: 'Hello' + ' ' + user.firstname + ' ' + 'your otp is' + ' ' + otp,
      };

      const response = await transporter.sendMail(mailOptions);

      return {
        otp: otp,
        id: user.id,
      };
    } else {
      return {
        status: 'no user found',
      };
    }
  }

  public async getTypes(type: any, body: any) {
    let data: any = {};
    // console.log('body', body);
    // console.log(type, 'type');

    data = await axios.post(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
        body.lat +
        ',' +
        body.long +
        '&radius=2000&type=' +
        type +
        '&key=AIzaSyBI_ae3Hvrib8Bao3_WrhXLEHKuGj1J8pQ',
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    let finalResponse: any = [];

    finalResponse = await finalResponse.concat(data.data.results);
    //  console.log(finalResponse, 'final');
    // console.log(data, 'datadad');

    return finalResponse;
  }
  public async mapNotifications(result: any, notificationData: any) {
    notificationData.map((notification: any) => {
      if (notification.placeId === result.place_id) {
        console.log('Object found inside the array.');
      } else {
        const placeArry: any = notification.place_id;
        placeArry.push(result.place_id);
        console.log('array', placeArry);
      }
    });
  }

  public async notifications(data: any, message: any) {
    const information: any = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      app_id: '8d39b7db-d029-4bbd-af58-20e3f53cc4a9',

      // eslint-disable-next-line @typescript-eslint/camelcase
      include_player_ids: [data],

      contents: {
        en: message,
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
    // console.log('details', details);

    // console.log(data, text, 'any');
  }

  @post('/users/userDetails/', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async movies(@requestBody() body: any): Promise<any> {
    let value: Array<object> = [];
    let result: any = [];
    let response: any = [];

    let endDate: any = [];
    let budgetPerDay: any;

    let finalResult: Array<object> = [];

    const location = await this.userRepository.findById(body.userId);

    console.log('post/user/userDetails');

    console.log('***********');

    if (location.lat === body.lat && location.long === body.long) {
      return {
        status: '400',
      };
    } else {
      console.log('location', location.lat, location.long, body.lat, body.long);
      const preference: any = await this.travelPreferenceRepository.find(
        {
          where: {userId: body.userId},
        },
        {strictObjectIDCoercion: true},
      );
      const id = body.userId;
      const data1 = {
        lat: body.lat,
        long: body.long,
      };

      await this.userRepository.updateById(id, data1);
      preference.map(async (data2: any) => {
        if (data2.travelDate) {
          const currentDate: any = moment().format('YYYY-MM-DD');
          console.log('if current date is not between ', currentDate);

          const a: any = moment(data2.travelDate, 'DD-MM-YYYY');
          const b: any = moment(data2.travelDate, 'DD-MM-YYYY');
          const startDate = b.format('YYYY-MM-DD');
          console.log('startdate', startDate);
          endDate = a.add(data2.daysCount, 'days');
          const dates: any = endDate.format('YYYY-MM-DD');

          console.log('end date', dates);

          if (
            moment(currentDate).isBetween(startDate, dates) ||
            moment(currentDate).isSame(startDate)
          ) {
            if (data2.selectedCategories !== null) {
              data2.selectedCategories.map((text: any) => {
                text.subCategories.map((test1: any) => {
                  if (test1.selected === true) {
                    if (!value.includes(test1.categoryname)) {
                      value = value.concat(test1.categoryname);
                    }
                  }
                });
              });
              console.log('total budget', data2.totalBudget);
              console.log('days count', data2.daysCount);
              budgetPerDay = data2.totalBudget / data2.daysCount;
            }
          }
        }
      });
      console.log('valuees', value);
      console.log('budget', budgetPerDay);

      value.map(async (type: any) => {
        console.log(type, 'type');
        const placeType: any = await this.categoriesRepository.find({
          where: {categoryname: type},
        });
        console.log('placeType', placeType[0].googleCategory);
        result = await this.getTypes(placeType[0].googleCategory, body);
        // if (budgetPerDay > 50) {
        //   console.log('hello');
        // }
        console.log('Api result : ', result);
        if (result.length !== 0) {
          console.log('case 1 : ');
          if (budgetPerDay >= 100) {
            finalResult = [];
            result.map((rating: any) => {
              if (rating.rating >= 4) {
                console.log('shop name : ', rating.name);

                finalResult = finalResult.concat(rating);
              }
            });
          } else if (budgetPerDay < 100 && budgetPerDay >= 50) {
            finalResult = [];
            result.map((rating: any) => {
              if (rating.rating >= 3 && rating.rating < 4) {
                console.log('shop name123 : ', rating.name);

                finalResult = finalResult.concat(rating);
              }
            });
          } else if (budgetPerDay < 50) {
            finalResult = [];
            result.map((rating: any) => {
              if (rating.rating < 3) {
                console.log('shop name1234 : ', rating.name);

                finalResult = finalResult.concat(rating);
              }
            });
          } else {
            console.log('error');
          }

          finalResult = await finalResult.slice(0, 3);
          // finalResult = await finalResult.slice(
          //   finalResult.length,
          //   finalResult.length + 3,
          // );
          console.log('final result : ', finalResult);
          const userInterest: any = finalResult.map((type1: any) => type1.name);
          console.log('userInterest : ', userInterest);
          // await this.notifications(
          //   body,
          //   userInterest,
          //   placeType[0].googleCategory,
          // );
        }

        // eslint-disable-next-line require-atomic-updates
        // eslint-disable-next-line @typescript-eslint/await-thenable
        response = response.concat(finalResult);
      });

      console.log('response: ', response);

      response.map(async (value2: any) => {
        const notification =
          'Hello' +
          ' ' +
          body.firstname +
          ',' +
          'These are some of the famous places near you' +
          ' ' +
          ' ' +
          value2.name;
        const data = {
          date: Date.now(),
          notification: notification,

          placeId: value2.place_id,
          userId: body.id,
          lat: value2.geometry.location.lat,
          lng: value2.geometry.location.lng,
        };
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        const NotificationData = await this.notificationsRepository.create(
          data,
        );
        console.log('Notification Data : ', NotificationData);
      });

      if (value) {
        return {
          status: 'Success',
          statuscode: 200,
        };
      } else {
        return {
          status: 'failure',
          statuscode: '400',
        };
      }
    }
  }

  @get('/users/push-notifications', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async notify(): Promise<any> {
    console.log('get/users/push-notifications');
    console.log('*********');
    const currentDate: any = moment().format();
    console.log('current day :', currentDate);
    let budgetPerDay = 0;
    const response: any = [];
    const body: any = [];

    const activePreferences = await this.travelPreferenceRepository.find(
      {
        where: {
          and: [
            {travelDate: {lte: currentDate}},
            {endDate: {gte: currentDate}},
          ],
        },
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    // console.log('active preferences', activePreferences.id);
    let finalResult: Array<object> = [];
    let userData: any;
    let CategoriesCount = 0;
    const activePreferencesCount = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let preferenceCategoriesLength = null;

    activePreferences.map(async (preference: any) => {
      // console.log('prefrence ', preference.id);
      const notificationData: any = await this.notificationsRepository.find(
        {
          where: {
            travelPreferenceId: preference.id,
          },
        },
        {
          strictObjectIDCoercion: true,
        },
      );
      // console.log('notificationDtaa', notificationData);
      // activePreferencesCount = activePreferencesCount + 1;
      let selectedSubCategory: any;
      if (preference.selectedCategories !== null) {
        // console.log('preference', preference.userId);
        userData = await this.userRepository.findById(preference.userId);

        // console.log('userData', userData);
        // console.log('selectedCategories', preference.selectedCategories);
        preferenceCategoriesLength = preference.selectedCategories.length;
        CategoriesCount = 0;

        await preference.selectedCategories.map(async (categories: any) => {
          CategoriesCount = CategoriesCount + 1;
          await categories.subCategories.map(async (subCategory: any) => {
            if (subCategory.selected === true) {
              selectedSubCategory = subCategory.categoryname;
              budgetPerDay = preference.totalBudget / preference.daysCount;
              const placeType: any = await this.categoriesRepository.find({
                where: {categoryname: selectedSubCategory},
              });
              const locationData = {
                lat: 30.2672,
                long: -97.7431,
              };
              const result = await this.getTypes(
                placeType[0].googleCategory,
                locationData,
              );
              const placeArray: any = [];
              await notificationData.map((type123: any) => {
                placeArray.push(type123.placeId);
              });

              // console.log('placearray', placeArray);
              // console.log(result.length, 'klength');
              if (placeArray.length === notificationData.length) {
                if (result.length !== 0) {
                  await result.map((rating: any) => {
                    //console.log('rating_123', rating.place_id);
                    if (placeArray.includes(rating.place_id)) {
                      console.log('value exists', placeArray, rating.place_id);
                    } else {
                      placeArray.push(rating.place_id);
                      if (budgetPerDay >= 100) {
                        if (rating.rating >= 4) {
                          finalResult = finalResult.concat(rating);
                        }
                      } else if (budgetPerDay < 100 && budgetPerDay >= 50) {
                        if (rating.rating >= 3 && rating.rating < 4) {
                          finalResult = finalResult.concat(rating);
                        }
                      } else if (budgetPerDay < 50) {
                        if (rating.rating < 3) {
                          finalResult = finalResult.concat(rating);
                        }
                      } else {
                        console.log('error');
                      }
                    }
                  });
                }
              }
              finalResult = await finalResult.slice(0, 1);

              console.log(' /********************* / ');
              if (finalResult.length !== 0) {
                const newResult = {
                  ...finalResult,
                  travelPreferenceId: preference.id,
                };

                // console.log('new result', newResult);

                response.push(newResult);
              }
            }
            finalResult = [];
          });
        });
        body.push(userData);
      }
    });

    setTimeout(() => {
      // const set = new Set(response);
      // const response1 = [...set];
      // const response1: any = [];
      // const uniq: any = {};
      // // const arr = [{id: '1'}, {id: '1'}, {id: '2'}];
      // const response1 = response.filter(
      //   (obj: any) => !uniq[obj.place_id] && (uniq[obj.place_id] = true),
      // );
      // console.log('arrFiltered', response1);

      // const objects = [
      //   {x: 1, y: 2},
      //   {x: 2, y: 1},
      //   {x: 1, y: 2},
      // ];

      const response1: any = _.uniqWith(response, _.isEqual);
      console.log('response1', response1);
      // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
      let length = 0;
      body.map(async (user: any) => {
        if (user !== undefined) {
          const travelData: any = await this.travelPreferenceRepository.find(
            {
              where: {
                userId: user.id,
              },
            },
            {
              strictObjectIDCoercion: true,
            },
          );
          length = length + 1;

          const result = travelData.map((a: any) => a.id.toString());

          let message = '';

          if (Object.keys(response).length !== 0) {
            message =
              'Here are some suggestions based on your interests. Please check in  notifications';
          } else {
            message =
              'Sorry, There are no suggestions based on your interest selection';
          }

          console.log('message', message);
          console.log('length', body.length, length);
          if (length === body.length) {
            await this.notifications(user.deviceId, message);
          }

          response1.map(async (res: any) => {
            if (res['0'] !== undefined) {
              console.log('Resplace_id', res.travelPreferenceId);
              if (result.includes(res.travelPreferenceId.toString())) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                const notifyData: any = await this.notificationsRepository.find(
                  {
                    where: {
                      travelPreferenceId: res.travelPreferenceId,
                    },
                  },
                  {
                    strictObjectIDCoercion: true,
                  },
                );
                console.log('notify', notifyData);

                const notifyPlaces: any = notifyData.map((test: any) => {
                  return test.placeId;
                });
                const notifyNames: any = notifyData.map((test: any) => {
                  return test.name;
                });
                console.log('placessss', notifyPlaces, notifyNames);
                // const notifyTravel: any = notifyData.map((test: any) => {
                //   return test.travelPreferenceId;
                // });

                if (notifyPlaces.length === notifyData.length) {
                  // console.log('notify places', notifyPlaces);
                  // console.log("res['0'].placeid", res['0'].place_id);
                  if (notifyPlaces.includes(res['0'].place_id.toString())) {
                    console.log('duplicate data');
                  } else {
                    console.log('create data');
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.notificationsRepository.create({
                      date: Date.now(),
                      notification:
                        'Hello' +
                        ' ' +
                        user.firstname +
                        ',' +
                        ' ' +
                        'here is a recommendation near you' +
                        ' ' +
                        '-' +
                        ' ' +
                        res['0'].name,
                      placeId: res['0'].place_id,
                      userId: user.id,
                      lat: res['0'].geometry.location.lat,
                      long: res['0'].geometry.location.lng,
                      icon: res['0'].icon,
                      name: res['0'].name,
                      travelPreferenceId: res.travelPreferenceId,
                    });
                  }
                }
              }
            }
          });
        }
      });
    }, 10000);

    if (Object.keys(response).length !== 0) {
      return {
        status: 'Success',
        statuscode: 200,
      };
    } else {
      return {
        status: 'failure',
        statuscode: '400',
      };
    }
  }

  @get('/users/push-notifications-for-culniry', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async statusUpdate(): Promise<any> {
    console.log('get/users/push-notifications-for-culniry');
    console.log('***********');
    const currentDate: any = moment().format();
    console.log('current day :', currentDate);
    let budgetPerDay = 0;
    const response: any = [];
    const body: any = [];

    const activePreferences = await this.travelPreferenceRepository.find(
      {
        where: {
          and: [
            {travelDate: {lte: currentDate}},
            {endDate: {gte: currentDate}},
          ],
        },
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    console.log('active preference :', activePreferences);
    let finalResult: Array<object> = [];
    let selectedSubCategory = '';
    let userData: any;
    activePreferences.map(async (preference: any) => {
      const notificationData: any = await this.notificationsRepository.find(
        {
          where: {
            travelPreferenceId: preference.id,
          },
        },
        {
          strictObjectIDCoercion: true,
        },
      );
      if (preference.selectedCategories !== null) {
        userData = await this.userRepository.findById(preference.userId);

        preference.selectedCategories.map((categores: any) => {
          if (categores.categoryname === 'Culinary') {
            categores.subCategories.map(async (subCategory: any) => {
              if (subCategory.selected === true) {
                console.log('selected Categories : ', subCategory.categoryname);
                selectedSubCategory = subCategory.categoryname;
                console.log('selected sub category : ', selectedSubCategory);
                budgetPerDay = preference.totalBudget / preference.daysCount;
                console.log('Budget per day : ', budgetPerDay);
                const placeType: any = await this.categoriesRepository.find({
                  where: {categoryname: selectedSubCategory},
                });
                const locationData = {
                  lat: 30.2672,
                  long: -97.7431,
                };
                const result = await this.getTypes(
                  placeType[0].googleCategory,
                  locationData,
                );
                const placeArray: any = [];
                await notificationData.map((type123: any) => {
                  placeArray.push(type123.placeId);
                });
                console.log('placearray', placeArray);
                console.log(result.length, 'klength');
                console.log('Near preferences types : ', result);
                if (placeArray.length === notificationData.length) {
                  if (result.length !== 0) {
                    await result.map((rating: any) => {
                      // console.log('rating_123', rating.place_id);
                      if (placeArray.includes(rating.place_id)) {
                        console.log('value exists');
                      } else {
                        placeArray.push(rating.place_id);
                        if (budgetPerDay >= 100) {
                          if (rating.rating >= 4) {
                            finalResult = finalResult.concat(rating);
                          }
                        } else if (budgetPerDay < 100 && budgetPerDay >= 50) {
                          if (rating.rating >= 3 && rating.rating < 4) {
                            finalResult = finalResult.concat(rating);
                          }
                        } else if (budgetPerDay < 50) {
                          if (rating.rating < 3) {
                            finalResult = finalResult.concat(rating);
                          }
                        } else {
                          console.log('error');
                        }
                      }
                    });
                  }
                }
                // console.log(' /********************* / ');
                finalResult = await finalResult.slice(0, 1);

                console.log('final result : ', finalResult);
                // const userInterest: any = finalResult.map(
                //   (type1: any) => type1.name,
                // );
              }
              finalResult = [];
            });
          }
        });
        body.push(userData);
      }
    });

    setTimeout(() => {
      // const set = new Set(response);
      // const response1 = [...set];
      const response1: any = _.uniqWith(response, _.isEqual);
      console.log('response1', response1);
      let length = 0;

      body.map(async (user: any) => {
        if (user !== undefined) {
          const travelData: any = await this.travelPreferenceRepository.find(
            {
              where: {
                userId: user.id,
              },
            },
            {
              strictObjectIDCoercion: true,
            },
          );
          length = length + 1;

          const result = travelData.map((a: any) => a.id.toString());

          let message = '';
          if (Object.keys(response).length !== 0) {
            message =
              'Here are some suggestions based on your interests. Please check in  notifications';
          } else {
            message =
              'Sorry, There are no suggestions based on your interest selection';
          }

          console.log('message', message);

          console.log('response', response);
          if (length === body.length) {
            await this.notifications(user.deviceId, message);
          }

          response1.map(async (res: any) => {
            if (res['0'] !== undefined) {
              if (result.includes(res.travelPreferenceId.toString())) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                const notifyData: any = await this.notificationsRepository.find(
                  {
                    where: {
                      travelPreferenceId: res.travelPreferenceId,
                    },
                  },
                  {
                    strictObjectIDCoercion: true,
                  },
                );
                console.log('notify', notifyData);
                const notifyPlaces: any = notifyData.map((test: any) => {
                  return test.placeId;
                });
                if (notifyPlaces.length === notifyData.length) {
                  console.log('notify places', notifyPlaces);
                  console.log("res['0'].placeid", res['0'].place_id);
                  if (notifyPlaces.includes(res['0'].place_id)) {
                    console.log('duplicate data');
                  } else {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    const data: any = this.notificationsRepository.create({
                      date: Date.now(),
                      notification:
                        'Hello' +
                        ' ' +
                        user.firstname +
                        ',' +
                        ' ' +
                        'here is a recommendation near you' +
                        ' ' +
                        '-' +
                        ' ' +
                        res['0'].name,
                      placeId: res['0'].place_id,
                      userId: user.id,
                      lat: res['0'].geometry.location.lat,
                      long: res['0'].geometry.location.lng,
                      icon: res['0'].icon,
                      name: res['0'].name,
                      travelPreferenceId: res.travelPreferenceId,
                    });
                    console.log('data', data);
                  }
                }
              }
            }
          });
        }
      });
    }, 10000);

    if (Object.keys(response).length !== 0) {
      return {
        status: 'Success',
        statuscode: 200,
      };
    } else {
      return {
        status: 'failure',
        statuscode: '400',
      };
    }
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<any> {
    // ensure the user exists, and the password is correct
    console.log('users/login');
    console.log('***********');
    const email: any = credentials.email.toLowerCase();
    credentials.email = email;
    console.log('email', credentials.email);
    const mykey = await crypto.createCipher('aes-128-cbc', 'mypassword');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mystr = mykey.update(credentials.password, 'utf8', 'hex');
    mystr = mystr + mykey.final('hex');

    // eslint-disable-next-line require-atomic-updates
    credentials.password = mystr;
    console.log('encrypted password', credentials.password);

    const extUser: any = await this.userRepository.findOne({
      where: {email: credentials.email, password: credentials.password},
    });
    let otp = 0;
    if (extUser) {
      if (extUser.verified === false) {
        const id = Math.random() * 10000;
        otp = Math.floor(id);
        const mailOptions = {
          from: 'info@staytune.com',
          to: credentials.email,
          subject: 'Email Verification from Staytune',
          html:
            'Hello ' +
            extUser.firstname +
            ' ' +
            extUser.lastname +
            ', The otp to verify your email address is ' +
            otp +
            '<br>',
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.message);
          }
        });

        return {
          id: extUser.id,
          message: 'User not verified',
          otp: otp,
        };
      } else {
        const user = await this.userService.verifyCredentials(credentials);
        // console.log(user, 'user');
        user.deviceId = credentials.deviceId;
        let id = '';
        id = user.id;
        await this.userRepository.updateById(id, user);
        const value: any = {
          email: extUser.email,
          deviceId: extUser.deviceId,
        };
        const data: any = await this.dummyDataRepository.create(value);
        console.log('data', data);
        const userData = await this.userRepository.findById(id);
        console.log('user Data', userData);

        // convert a User object into a UserProfile object (reduced set of properties)
        const userProfile = this.userService.convertToUserProfile(user);

        // create a JSON Web Token based on the user profile
        const token = await this.jwtService.generateToken(userProfile);
        user.token = token;
        return userData;
      }
    } else {
      return {
        message: 'User does not exist',
        status: 'failed',
      };
    }
  }
}
