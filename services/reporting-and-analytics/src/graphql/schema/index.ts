import { gql } from "graphql-tag";

import { mergeTypeDefs } from "@graphql-tools/merge";
import { allDataTypeDefs } from "./allData";

// Base schema with a dummy Query root
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
`;

export const typeDefs = mergeTypeDefs([
 
  allDataTypeDefs
]);
