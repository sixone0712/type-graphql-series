import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { MyContext } from '../../types/MyCentext';
import { v4 } from 'uuid';
import { sendEmail } from '../utils/sendmail';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';

// @Resolver(User)
@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24); // 1 day expriation

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`,
    );

    return true;
  }
}
