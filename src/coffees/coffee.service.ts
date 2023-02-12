import { Injectable } from '@nestjs/common';
import * as GraphQLTypes from "../graphql-types";
import {InjectRepository} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffee.entity";
import {Repository} from "typeorm";
import {UserInputError} from "apollo-server-express";
import {Flavor} from "./entities/flavor.entity";
import {PubSub} from "graphql-subscriptions";

@Injectable()
export class CoffeeService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorsRepository: Repository<Flavor>,
        private readonly pubSub: PubSub,
    ) {
    }

    async findAll(): Promise<Coffee[]> {
        return this.coffeeRepository.find();
    }

    async findOne(id: number): Promise<Coffee> {
        const coffee = await this.coffeeRepository.findOneBy({id});
        if (!coffee) {
            throw new UserInputError(`Coffee #${id} not found.`);
        }
        return coffee;
    }

    async create(dto: GraphQLTypes.CreateCoffeeInput): Promise<Coffee> {
        const flavors = await Promise.all(
            dto.flavors.map(name => this.preloadFlavorByName(name)),
        );

        const coffee = await this.coffeeRepository.create({...dto, flavors});

        const newCoffeeEntity = await this.coffeeRepository.save(coffee);
        this.pubSub.publish('coffeeAdded', { coffeeAdded: newCoffeeEntity});

        return newCoffeeEntity;
    }

    async update(id: number, dto: GraphQLTypes.UpdateCoffeeInput): Promise<Coffee> {
        const flavors =
            dto.flavors &&
            (await Promise.all(
                dto.flavors.map(name => this.preloadFlavorByName(name))
            ));

        const entity = await this.coffeeRepository.preload({
            ...dto,
            id,
            flavors
        });

        if (!entity) {
            throw new UserInputError(`Coffee #${id} not found.`);
        }

        return this.coffeeRepository.save(entity);
    }

    async remove(id: number): Promise<Coffee> {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorsRepository.findOne({ where: { name } });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorsRepository.create({ name });
    }
}
