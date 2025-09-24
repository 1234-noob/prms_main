import { gql } from "graphql-tag";

export const allDataTypeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    contactNo: String
    address: String
    contracts: [Contract!]!
    propertyPart:[PropertyPart!]!
    tenants: [Tenant!]!        
    properties: [Property!]!   
    payments: [Invoice!]!      
  }

  type Contract {
    id: ID!
    organization_id: ID!
    tenant_ids: [ID!]!
    property_id: ID!
    property_part_id: ID
    startDate: String
    endDate: String
    organization: Organization!
    tenants: [Tenant!]!
    property: Property!
    propertyPart: PropertyPart
    payments: [Invoice!]!
  }

  type Tenant {
    id: ID!
    name: String!
    email: String
    contracts: [Contract!]!
    payments: [Invoice!]!
    propertyPart:[PropertyPart!]!
    organizations: [Organization!]!  # Derived from contracts
    properties: [Property!]!         # Derived from contracts
  }

  type Property {
    id: ID!
    name: String!
    location: String
    contracts: [Contract!]!
    propertyParts: [PropertyPart!]!
    organization: Organization!      # Derived from contract
    tenants: [Tenant!]!              # Derived from contracts
    payments: [Invoice!]!            # Derived from contracts/tenants
  }

  type PropertyPart {
    id: ID!
    name: String!
    status:String!
    property_id:String!
   payments: [Invoice!]!  
 tenants: [Tenant!]!  
    contracts: [Contract!]!
    property: Property!
    organization: Organization!      # Through property → contract
  }

  type Invoice {
    id: ID!
    amount: Float!
    tenant_id: ID!
    tenant: Tenant!
    contract: Contract
    organization: Organization!      # Derived from contract
    property: Property               # Derived from contract
    propertyParts: [PropertyPart!]!
  }

  type Query {
    organizations: [Organization!]!
    organization(id: ID!): Organization

    tenants: [Tenant!]!
    tenant(id: ID!): Tenant

    contracts: [Contract!]!
    contract(id: ID!): Contract

    properties: [Property!]!
    property(id: ID!): Property

    propertyParts: [PropertyPart!]!
    propertyPart(id: ID!): PropertyPart

    payments: [Invoice!]!
    payment(id: ID!): Invoice
  }
`;
