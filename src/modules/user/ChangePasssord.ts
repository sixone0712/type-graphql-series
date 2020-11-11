import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';
import { ChangePasswordInput } from './changePassword/changePasswordInput';
import bcrypt from 'bcryptjs';
import { MyContext } from '../../types/MyCentext';

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) return null;

    const user = await User.findOne(userId);

    if (!user) return null;

    await redis.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    ctx.req.session.userId = user.id; // 이걸 하는 이유는????? 쿠키를 받고 로그인...?

    return user;
  }
}
