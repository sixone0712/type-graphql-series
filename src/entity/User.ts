import { Field, ID, ObjectType, Root } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@ObjectType()   // graphql
@Entity()
export class User extends BaseEntity{

    @Field(() => ID)    // graphql
    @PrimaryGeneratedColumn()
    id: number;

    @Field()    // graphql
    @Column()
    firstName: string;

    @Field()    // graphql
    @Column()
    lastName: string;

    // @Field()
    // name: string;

    @Field()
    name(@Root() parent: User): string {
      return `${parent.firstName} ${parent.lastName}`;
    }
  
    @Field()    // graphql
    @Column("text", { unique: true })
    email: string;

    @Column()
    password: string;

}