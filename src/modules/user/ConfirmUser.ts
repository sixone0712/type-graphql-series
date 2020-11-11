import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { MyContext } from '../../types/MyCentext';
import { confirmUserPrefix } from '../constants/redisPrefixes';

// @Resolver(User)
@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confimUser(@Arg('token') token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) return false;

    await User.update({ id: +userId }, { confirmed: true });

    return true;
  }
}
