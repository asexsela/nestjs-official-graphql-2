import * as GraphQLTypes from "../../graphql-types";
import {IsOptional, MinLength} from "class-validator";

export class UpdateCoffeeInput extends GraphQLTypes.UpdateCoffeeInput {
    @IsOptional()
    @MinLength(3)
    name: string;
}
