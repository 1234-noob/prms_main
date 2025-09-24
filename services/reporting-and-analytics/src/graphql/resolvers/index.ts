import { allDataResolvers } from "./allDataResolver";


import { mergeResolvers } from "@graphql-tools/merge";


export const resolvers = mergeResolvers([
   
    allDataResolvers

])