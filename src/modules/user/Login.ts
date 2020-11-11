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
import { MyContext } from '../../types/MyCentext';

// @Resolver(User)
@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    console.log('user.confirmed', user.confirmed);
    if (!user.confirmed) return null;

    ctx.req.session!.userId = user.id;

    return user;
  }
}
