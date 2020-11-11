import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
//import * as bcript from 'bcryptjs';
import bcrypt from 'bcryptjs'; // "allowSyntheticDefaultImports": true,
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { sendEmail } from '../utils/sendmail';
import { createconfirmationUrl } from '../utils/createConfirmationUrl';

// @Resolver(User)
@Resolver()
export class RegisterResolver {
  // @Authorized()
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return 'Hello World!!';
  }

  // @FieldResolver()
  // async name(@Root() parent: User) {
  //   return `${parent.firstName} ${parent.lastName}`
  // }

  @Mutation(() => User)
  async register(
    // @Arg('firstName') firstName: string,
    // @Arg('lastName') lastName: string,
    // @Arg('email') email: string,
    // @Arg('password') password: string
    @Arg('data') { firstName, lastName, email, password }: RegisterInput,
  ): Promise<User> {
    const hashedPasswrod = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPasswrod,
    }).save();

    await sendEmail(email, await createconfirmationUrl(user.id));

    return user;
  }
}
