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
import {UserRepository} from '../repositories';
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

//const CircularJSON = require('circular-json');

import axios from 'axios';

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
    let data: any;

    const location = await this.userRepository.findById(body.userId);
    if (location.lat === body.lat && location.long === body.lang) {
      return {
        status: '400',
      };
    } else {
      const preference = await this.travelPreferenceRepository.find(
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

      // console.log(
      //   preference,
      //   'prefere',
      // );

      // eslint-disable-next-line no-unused-expressions
      // eslint-disable-next-line prefer-const
      preference.map(data2 => {
        if (data2.selectedCategories !== null) {
          data2.selectedCategories.map(text => {
            console.log(text, 'text');
          });
        }
      });

      // const value1 = value.map(app => app)

      // if (data2.selectedTravelPreferences.selected === true) {
      //   console.log('hello');}
      //   data = await axios(
      //     'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
      //       body.lat +
      //       ',' +
      //       body.long +
      //       '&radius=1500&type=restaurant&key=AIzaSyBI_ae3Hvrib8Bao3_WrhXLEHKuGj1J8pQ',
      //     {
      //       headers: {
      //         'content-type': 'application/json',
      //       },
      //       method: 'POST',
      //     },
      //   );
      //   // console.log(data, 'datadfdfd');
      // }

      // eslint-disable-next-line prefer-const

      // type.forEach((notify: any) => console.log(notify.selected));

      // eslint-disable-next-line prefer-const
      // data = await axios(
      //   'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
      //     body.lat +
      //     ',' +
      //     body.long +
      //     '&radius=1500&type=restaurant&key=AIzaSyBI_ae3Hvrib8Bao3_WrhXLEHKuGj1J8pQ',
      //   {
      //     headers: {
      //       'content-type': 'application/json',
      //     },
      //     method: 'POST',
      //   },
      // );

      // const test = data.data.results.map((data1: any) => data1.name);
      // // console.log(test, 'tset');
      // const hotels = test.slice(0, 3);

      const information: any = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        app_id: '8d39b7db-d029-4bbd-af58-20e3f53cc4a9',
        // data: {
        //   data: test,
        // },

        // eslint-disable-next-line @typescript-eslint/camelcase
        include_player_ids: [body.id],
        // data: {
        //   response: '200',
        // },
        contents: {en: 'these are the famous restaurants near u'},
      };

      // console.log(information.data.data, 'datahbhhh');

      // const details = await axios.post(
      //   'https://onesignal.com/api/v1/notifications',
      //   information,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization:
      //         'Basic NDA5YWNmM2UtODFhZi00MzMzLTg0OTItYTFiODg0OTA4Njlk',
      //     },
      //   },
      // );
      // console.log('details', details);

      // return {
      //   data: details.data,
      // };
      // console.log(location, 'location');
      // return {
      //   location: body.location,
      //   details: test,
      // };
      // return {
      //   details: test.slice(0, 3),
      // };
    }
  }

  @post('/users/notifications', {
    responses: {
      '200': {
        description: 'Array of Admin model instances',
        headers: {
          'content-type': 'application/json',
        },
      },
    },
  })
  async notifications(@requestBody() data: any): Promise<any> {
    const information: any = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      app_id: '8d39b7db-d029-4bbd-af58-20e3f53cc4a9',
      // data: {
      //   data: 'hello this is one signal',
      // },
      // eslint-disable-next-line @typescript-eslint/camelcase
      include_player_ids: [data.id],
      contents: {en: 'hello one signal '},
    };
    const details: any = await axios.post(
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

    console.log(details, 'details');

    // const str = CircularJSON.stringify(details);
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
