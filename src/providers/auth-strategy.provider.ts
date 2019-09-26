// import {BasicStrategy} from 'passport-http';
// import {Provider, inject, ValueOrPromise} from '@loopback/context';
// import {Request} from '@loopback/rest';
// import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
// import {Strategy} from 'passport';
// import {repository} from '@loopback/repository';
// import {
//   AuthenticationBindings,
//   AuthenticationMetadata,
// } from '@loopback/authentication';
// import {
//   AuthenticationStrategy,
//   UserProfile,
//   TokenService,
// } from '@loopback/authentication';
// import {User} from '../models';
// import {UserRepository} from '../repositories';
// // import { UserProfile } from '@loopback/security';

// interface Payload {
//   userId: string;
// }

// export class AuthStrategyProvider implements Provider<Strategy | undefined> {
//   constructor(
//     @inject(AuthenticationBindings.METADATA)
//     private metadata: AuthenticationMetadata,
//     @repository(UserRepository)
//     public userRepository: UserRepository,
//   ) {}

//   value(): ValueOrPromise<Strategy | undefined> {
//     if (!this.metadata) return undefined;
//     const name = this.metadata.strategy;
//     switch (name) {
//       case 'BasicStrategy':
//         return new BasicStrategy(
//           {
//             passReqToCallback: true,
//           },
//           this.verifyBasic.bind(this),
//         );
//       case 'JwtStrategy':
//         return new JwtStrategy(
//           {
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: 'secret',
//           },
//           this.verifyJwt.bind(this),
//         );
//       default:
//         return Promise.reject(`The strategy ${name} is not available.`);
//     }
//   }

//   async verifyJwt(
//     {userId}: Payload,
//     done: (err: Error | null, user?: UserProfile|false) => void,
//   ) {
//     let user: User | null = null;
//     const users = await this.userRepository.find({
//       where: {id: userId},
//     });
//     if (users.length) [user] = users;
//     if (user) {
//       return done(null, {
//         id: <string>user.id,
//       });
//     }
//     return console.log('done');
//   }

//   async verifyBasic(
//     _req: Request,
//     email: string,
//     password: string,
//     done: (err: Error | null, user?: UserProfile | false) => void,
//   ) {
//     let user: User | null = null;
//     const users = await this.userRepository.find({
//       where: {email},
//     });
//     if (users.length) [user] = users;
//     if (user && user.validatePassword(password)) {
//       return done(null, {
//        SecurityId: <string>user.id,
//       });
//     }
//     return done(null, false);
//   }
// }
