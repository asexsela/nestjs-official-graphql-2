import { Module } from '@nestjs/common';
import { CoffeesResolver } from './coffees.resolver';
import {CoffeeService} from "./coffee.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffee.entity";
import {Flavor} from "./entities/flavor.entity";
import { CoffeeFlavorsResolver } from './coffee-flavors.resolver';
import {PubSubModule} from "../pub-sub/pub-sub.module";
import { FlavorsByCoffeeLoader } from './data-loader/flavors-by-coffee.loader';

@Module({
  imports: [
      TypeOrmModule.forFeature([Coffee, Flavor]),
      PubSubModule
  ],
  providers: [CoffeesResolver, CoffeeService, CoffeeFlavorsResolver, FlavorsByCoffeeLoader]
})
export class CoffeesModule {}
