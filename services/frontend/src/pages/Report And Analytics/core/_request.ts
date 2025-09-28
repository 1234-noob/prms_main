import client from "../../../apolloClient"
import { gql } from "@apollo/client"


export const TEST_QUERY =  
       gql`query testContracts {
  contracts {
    endDate
    id
    startDate
    organization_id
    property_id
    property_part_id
    tenant_ids

organization {
  address
  contactNo
  address
  name
  id
}

tenants {
  email
  id
  name
  
}

property {
  id
  name
  location
  
}

propertyPart {
  id
  name
}
    
    payments {
      amount
      id
      tenant_id

    }
    
  }
}`
    


    