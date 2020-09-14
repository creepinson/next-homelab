import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: true })
    username: string;

    @Field()
    @Column()
    password: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    roles?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    name?: string;
}
