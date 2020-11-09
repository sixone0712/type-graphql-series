import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
//import * as bcript from 'bcryptjs';
import bcrypt from 'bcryptjs';    // "allowSyntheticDefaultImports": true,
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

// @Resolver(User)
@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!!"
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
    @Arg("data") {firstName, lastName, email, password} : RegisterInput,
    ): Promise<User> {
      const hashedPasswrod = await bcrypt.hash(password, 12);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPasswrod
      }).save();

    return user;
  }
}