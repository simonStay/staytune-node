import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  constrainDataObjects,
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
import {UserRepository, NotificationsRepository} from '../repositories';
import {TravelPreferencesRepository} from '../repositories';
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
const moment = require('moment');

//const CircularJSON = require('circular-json');

import axios from 'axios';
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
    finalResponse = await data.data.results.concat(data.data.results);
    console.log(finalResponse, 'final');
    console.log(data, 'datadad');

    return finalResponse;
  }

  public async notifications(data: any, text: any, parentCategory: any) {
    console.log(text, 'text');
    if (text.length !== 0) {
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
    const notify: any = [];
    let endDate: any = [];

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

      // const startDate = moment().format(preference.travelDate, 'DD-MM-YYYY');

      // const a = moment(startDate, 'DD-MM-YYYY');

      // console.log(a, 'jjjd');
      // console.log(b, 'hjbdvdvsd');
      // if (preference.travelDate) {
      //   // console.log(preference.travelDate, 'traveldate');
      // }

      // console.log(currentDate, 'xkvksdvksd');

      preference.map((data2: any) => {
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
                    if (!value.includes(test1.categoryname.toLowerCase())) {
                      value = value.concat(test1.categoryname.toLowerCase());
                    }
                  }
                });
              });
            }
          }
        }
      });
      console.log(value, 'valuees');

      value.map(async (type: any) => {
        console.log(type, 'type');
        if (type === 'food') {
          //   const placeType = 'restaurant';
          // } else if (type === 'botique') {
          //   const placeType = 'cloting_store';
          // } else if (type === 'bar') {
          //   const placeType = type;
          // } else if (type === 'cafe') {
          //   const placeType = type;
          // } else if (type === 'bakery') {
          //   const placeType = type;
          // } else if (type === 'amusement parks') {
          //   const placeType = 'amusement_park';
          // }else if(type==='night clubs'){
          //   const placeType='night_club'
          // }else if(type==='book stores'){
          //   const placeType='book_store'
          // }else if(type==='art'){
          //   const placeType='art_gallery'
          // }else if(type==='history'){
          //   const placeType='museum'
          // }else if(type==='park'){
          //   const placeType=type
          // }else if()
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          console.log(result, 'resultrrr');

          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Restaurants');
        } else if (type === 'boutique') {
          const placeType = 'clothing_store';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Boutiques');
        } else if (type === 'bar') {
          const placeType = 'bar';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Bars');
        } else if (type === 'cafe') {
          const placeType = 'cafe';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Cafes');
        } else if (type === 'bakery') {
          const placeType = 'bakery';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Bakeries');
        } else if (type === 'amusement parks') {
          const placeType = 'amusement_park';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Amusement_Paeks');
        } else if (type === 'night clubs') {
          const placeType = 'night_club';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Night_Clubs');
        } else if (type === 'book stores') {
          const placeType = 'book_store';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Book_Stores');
        } else if (type === 'art') {
          const placeType = 'art_gallery';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Art Gallery');
        } else if (type === 'history') {
          const placeType = 'museum';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Museums');
        } else if (type === 'park') {
          const placeType = 'park';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Parks');
        } else if (type === 'shopping mall') {
          const placeType = 'shopping_mall';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Shopping Malls');
        } else if (type === 'super market / groceries') {
          const placeType = 'grocery_or_supermarket';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Super Markets');
        } else if (type === 'gym') {
          const placeType = 'gym';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, ' Gyms');
        } else if (type === 'campground') {
          const placeType = 'campground';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Camp Grounds');
        } else if (type === 'department store') {
          const placeType = 'department_store';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Departmental Stores');
        } else if (type === 'electronics store') {
          const placeType = 'electronics_store';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Electronic Stores');
        } else if (type === 'convenience store') {
          const placeType = 'convenience_store';
          result = await this.getTypes(placeType, body);
          result = await result.slice(0, 3);
          const userInterest: any = result.map((type1: any) => type1.name);
          await this.notifications(body, userInterest, 'Convenience Stores');
          console.log(userInterest, 'uuuuuu');
        } else {
          return {
            response: 'does not exist',
          };
        }

        // eslint-disable-next-line require-atomic-updates
        // eslint-disable-next-line @typescript-eslint/await-thenable
        response = await response.concat(result);
      });
      console.log(response, 'respnse');

      setTimeout(() => {
        response.map((value2: any) => {
          // notify.push({
          //   date: Date,
          //   notification: value2.name,
          //   userId: body.userId,
          // });
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
