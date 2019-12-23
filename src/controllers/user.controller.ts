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

//const CircularJSON = require('circular-json');

import axios from 'axios';
import {type} from 'os';
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
    const link =
      'https://staytune.austinconversionoptimization.com/email-verification/?email=' +
      user.email;
    const id = Math.random() * 10000;
    const otp = Math.floor(id);
    const mailOptions = {
      from: 'info@staytune.com',
      to: user.email,
      subject: 'Email Verification from Staytune',
      html:
        'Hello ' +
        user.fullname +
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
    const extUser = await this.userRepository.findOne({
      where: {email: user.email},
    });
    if (extUser) {
      return {
        message: 'User already exists, Please login',
        status: 'failed',
      };
    } else {
      const mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let mystr = mykey.update(user.password, 'utf8', 'hex');
      mystr = mystr + mykey.final('hex');

      // eslint-disable-next-line require-atomic-updates
      user.password = mystr;

      const newUser = await this.userRepository.create(user);
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
  @authenticate('jwt')
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    currentUserProfile.id = currentUserProfile[securityId];
    return this.userRepository.find(filter);
  }

  @get('/surya', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async test() {
    console.log('hello surya by cron');
    return 'hai';
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
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
    await this.userRepository.updateById(id, user);
    const updatedData = await this.userRepository.findById(id);
    // console.log(checkUser, '5d9ab8211113661189ffb735');

    // console.log(updatedUser, 'userupdated');

    return {
      status: 'success',
      message: 'successfully Updated',
      data: updatedData,
    };
  }

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
    const user = await this.userRepository.findOne({
      where: {email: body.email},
    });
    if (user != null) {
      const id = Math.random() * 10000;
      const otp = Math.floor(id);
      console.log(otp, 'otp');

      const mailOptions = {
        from: 'info@staytune.com',
        to: user.email,
        subject: 'Email Verification from Staytune',
        html: 'Hello ' + user.fullname + 'your otp is' + otp,
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

    data = await axios(
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
        method: 'POST',
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

  public async notifications(data: any, text: any, parentCategory: any) {
    console.log(text, 'text');

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
    const details = axios.post(
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

    if (location.lat === body.lat && location.long === body.long) {
      return {
        status: '400',
      };
    } else {
      console.log(location.lat, location.long, body.lat, body.long, 'location');
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
      // console.log(preference, 'prefererencedeec');

      await this.userRepository.updateById(id, data1);
      preference.map(async (data2: any) => {
        // console.log(data2.travelDate, 'traveldate');
        if (data2.travelDate) {
          // const startDate = data2.travelDate
          //   .split('-')
          //   .reverse()
          //   .join('-');

          const currentDate: any = moment().format('YYYY-MM-DD');
          console.log(currentDate, 'if current date is not between ');

          const a: any = moment(data2.travelDate, 'DD-MM-YYYY');
          const b: any = moment(data2.travelDate, 'DD-MM-YYYY');
          const startDate = b.format('YYYY-MM-DD');
          console.log(startDate, 'startdate');
          endDate = a.add(data2.daysCount, 'days');
          const dates: any = endDate.format('YYYY-MM-DD');

          console.log(dates, 'dates');

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
              console.log(data2.totalBudget, 'total123');
              console.log(data2.daysCount, 'count123');
              budgetPerDay = data2.totalBudget / data2.daysCount;
            }
          }
        }
      });
      console.log(value, 'valuees');
      console.log(budgetPerDay, 'budget');

      value.map(async (type: any) => {
        console.log(type, 'type');
        const placeType: any = await this.categoriesRepository.find({
          where: {categoryname: type},
        });
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
          await this.notifications(
            body,
            userInterest,
            placeType[0].googleCategory,
          );
        }

        // eslint-disable-next-line require-atomic-updates
        // eslint-disable-next-line @typescript-eslint/await-thenable
        response = response.concat(result);
      });

      // console.log(response, 'respnse');

      setTimeout(() => {
        response.map((value2: any) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.notificationsRepository.create({
            date: Date.now(),
            notification:
              'Hello' +
              ' ' +
              body.userName +
              ',' +
              'These are some of the famous places near you' +
              ' ' +
              ' ' +
              value2.name,
            placeId: value2.place_id,
            userId: body.userId,
          });
        });
        // console.log(notify.notification, 'notifysss');
      }, 3000);
      // const notifylist = await this.notificationsRepository.find({
      //   where: {
      //     userId: body.userId,
      //   },
      // });
      // console.log(notifylist, 'suryaaa');
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
    const currentDate: string = moment().format('DD-MM-YYYY');
    console.log('current day :', currentDate);
    let budgetPerDay = 0;

    const activePreferences = await this.travelPreferenceRepository.find(
      {
        where: {
          and: [
            {travelDate: {lte: currentDate}},
            {endDate: {gte: currentDate}},
          ],
          // endDate: {gte: currentDate},
        },
      },
      {
        strictObjectIDCoercion: true,
      },
    );
    //console.log('current preferences : ', activePreferences);
    activePreferences.map(async (preference: any) => {
      // console.log('active preference : ', preference);

      if (preference.selectedCategories !== null) {
        const userData = await this.userRepository.findById(preference.userId);
        // console.log('user data : ', userData);
        let selectedSubCategory = '';
        preference.selectedCategories.map((categores: any) => {
          categores.subCategories.map((subCategory: any) => {
            if (subCategory.selected === true) {
              console.log('selected Categories : ', subCategory.categoryname);
              selectedSubCategory = subCategory.categoryname;
            }
          });
        });
        console.log('selected sub category : ', selectedSubCategory);
        budgetPerDay = preference.totalBudget / preference.daysCount;
        console.log('Budget per day : ', budgetPerDay);
        const placeType: any = await this.categoriesRepository.find({
          where: {categoryname: selectedSubCategory},
        });
        const locationData = {
          lat: '30.2672',
          long: '-97.7431',
        };
        const result = await this.getTypes(
          placeType[0].googleCategory,
          locationData,
        );
        // console.log('Near preferences types : ', result);
        let finalResult: Array<object> = [];
        if (result.length !== 0) {
          if (budgetPerDay >= 100) {
            result.map((rating: any) => {
              if (rating.rating >= 4) {
                finalResult = finalResult.concat(rating);
              }
            });
          } else if (budgetPerDay < 100 && budgetPerDay >= 50) {
            result.map((rating: any) => {
              if (rating.rating >= 3 && rating.rating < 4) {
                finalResult = finalResult.concat(rating);
              }
            });
          } else if (budgetPerDay < 50) {
            result.map((rating: any) => {
              if (rating.rating < 3) {
                finalResult = finalResult.concat(rating);
              }
            });
          } else {
            console.log('error');
          }
        }
        console.log(' /********************* / ');
        finalResult = await finalResult.slice(0, 1);
        console.log('final result : ', finalResult);
        const userInterest: any = finalResult.map((type1: any) => type1.name);
        console.log('userInterest : ', userInterest);
        const data = {
          id: userData.deviceId,
        };
        await this.notifications(
          data,
          userInterest,
          placeType[0].googleCategory,
        );
        console.log(' /********************* / ');
      }
    });

    // cron.schedule('* 5 * * *', () => {
    //   console.log('logs every minute');
    // });
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

    const mykey = await crypto.createCipher('aes-128-cbc', 'mypassword');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mystr = mykey.update(credentials.password, 'utf8', 'hex');
    mystr = mystr + mykey.final('hex');

    // eslint-disable-next-line require-atomic-updates
    credentials.password = mystr;
    console.log(credentials.password, 'pnascnnn');

    const extUser = await this.userRepository.findOne({
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
            extUser.fullname +
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
        console.log(user, 'user');
        // convert a User object into a UserProfile object (reduced set of properties)
        const userProfile = this.userService.convertToUserProfile(user);

        // create a JSON Web Token based on the user profile
        const token = await this.jwtService.generateToken(userProfile);
        user.token = token;
        return user;
      }
    } else {
      return {
        message: 'User does not exist',
        status: 'failed',
      };
    }
  }
}
