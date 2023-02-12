import * as GraphQLTypes from "../../graphql-types";
import {MinLength} from "class-validator";

export class CreateCoffeeInput extends GraphQLTypes.CreateCoffeeInput {
    @MinLength(3)
    name: string;
}
