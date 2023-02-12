import {Args, ID, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {ParseIntPipe} from "@nestjs/common";
import {CoffeeService} from "./coffee.service";
import {Coffee} from "./entities/coffee.entity";
import {CreateCoffeeInput} from "./dto/create-coffee.input";
import {UpdateCoffeeInput} from "./dto/update-coffee.input";
import {PubSub} from "graphql-subscriptions";

@Resolver()
export class CoffeesResolver {

    constructor(
        private readonly coffeeService: CoffeeService,
        private readonly pubSub: PubSub
    ) {}

    @Query('coffees')
    async findAll(): Promise<Coffee[]> {
        return this.coffeeService.findAll();
    }

    @Query(() => Coffee, {name: 'coffee'})
    async findOne(
        @Args('id', {type: () => ID}, ParseIntPipe) id: number
    ): Promise<Coffee> {
        return this.coffeeService.findOne(id);
    }

    @Mutation('createCoffee')
    async create(
        @Args('createCoffeeInput') dto: CreateCoffeeInput
    ): Promise<Coffee> {
        return this.coffeeService.create(dto);
    }

    @Mutation('updateCoffee')
    async update(
        @Args('id', ParseIntPipe) id: number,
        @Args('updateCoffeeInput') dto: UpdateCoffeeInput
    ): Promise<Coffee> {
        return this.coffeeService.update(id, dto);
    }

    @Mutation('removeCoffee')
    async remove(
        @Args('id', ParseIntPipe) id: number,
    ): Promise<Coffee> {
        return this.coffeeService.remove(id);
    }

    @Subscription(() => Coffee)
    coffeeAdded() {
        return this.pubSub.asyncIterator('coffeeAdded');
    }
}
