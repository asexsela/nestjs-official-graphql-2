import {Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectRepository} from "@nestjs/typeorm";
import {Flavor} from "./entities/flavor.entity";
import {Repository} from "typeorm";
import {Coffee} from "./entities/coffee.entity";
import * as GraphQLTypes from "../graphql-types"
import {FlavorsByCoffeeLoader} from "./data-loader/flavors-by-coffee.loader";

@Resolver('Coffee')
export class CoffeeFlavorsResolver {
    constructor(
        @InjectRepository(Flavor)
        private readonly flavorsRepository: Repository<Flavor>,
        private readonly flavorsByCoffeeLoader: FlavorsByCoffeeLoader
    ) {}

    @ResolveField('flavors')
    async getFlavorsOfCoffee(@Parent() coffee: Coffee) {
        return this.flavorsByCoffeeLoader.load(coffee.id);
    }
}
