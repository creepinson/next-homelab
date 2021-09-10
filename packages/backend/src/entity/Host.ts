import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
@ObjectType()
export class Host extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Column()
    @Field()
    address!: string;

    @Column()
    @Field()
    group!: string;
}
