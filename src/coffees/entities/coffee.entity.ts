import * as GraphQLTypes from '../../graphql-types';
import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Flavor} from "./flavor.entity";

@Entity()
export class Coffee implements GraphQLTypes.Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @JoinTable()
    @ManyToMany(
        type => Flavor,
        flavor => flavor.coffees,
        {
            cascade: true,
        },
    )
    flavors?: Flavor[];

    @Column({ nullable: true })
    type: GraphQLTypes.CoffeeType;

    @CreateDateColumn()
    createdAt?: Date | null;
}
