import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
//import * as bcript from 'bcryptjs';
import bcrypt from 'bcryptjs'; // "allowSyntheticDefaultImports": true,
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { MyContext } from '../../types/MyCentext';
import { userInfo } from 'os';

// @Resolver(User)
@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    console.log('ctx.req.session!.userId', ctx.req.session!.userId);

    // ! -> Non-Null Assertion Operator
    if (!ctx.req.session!.userId) {
      return undefined;
    }
    console.log('#33');
    return User.findOne(ctx.req.session!.userId);
  }
}
