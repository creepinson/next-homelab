import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column()
    password!: string;

    @Field(() => [String], { nullable: true })
    @Column({ nullable: true, type: "json" })
    roles?: string[];

    @Field({ nullable: true })
    @Column({ nullable: true })
    name?: string;
}
