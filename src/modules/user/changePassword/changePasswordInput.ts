import { MaxLength, Length, IsEmail, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PasswordInput } from '../../shared/PasswordInput';

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;

  // Replaced by extends PasswordInput
  // @Field()
  // @Min(5)
  // password: string;
}
