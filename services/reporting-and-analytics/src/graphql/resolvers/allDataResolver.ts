import {
  getAllContracts,
  getContractById,
} from "../../clients/contractClient";
import {
  getAllOrganizations,
  getOrganizationById,
} from "../../clients/organizationClient";
import {
  getAllInvoices,
  getInvoiceById,
} from "../../clients/paymentClient";
import {
  getAllProperties,
  getPropertyById,
} from "../../clients/propertyClient";
import {
  getAllPropertyParts,
  getPropertyPartById,
} from "../../clients/propertyPartsClient";
import {
  getAllTenantPropertyParts,
  getAllTenants,
  getTenantById,
} from "../../clients/tenantClient";

export const allDataResolvers = {
  Query: {
    organizations: async () => getAllOrganizations(),
    organization: async (_: any, { id }: { id: string }) =>
      getOrganizationById(parseInt(id)),

    tenants: async () => getAllTenants(),
    tenant: async (_: any, { id }: { id: string }) => getTenantById(parseInt(id)),

    contracts: async () => getAllContracts(),
    contract: async (_: any, { id }: { id: string }) => getContractById(parseInt(id)),

    properties: async () => getAllProperties(),
    property: async (_: any, { id }: { id: string }) => getPropertyById(parseInt(id)),

    propertyParts: async () => {
      const propertyParts = await getAllPropertyParts()
      return propertyParts.map((c:any) => ({
        id:c.id,
        name:c.part_name,
        status:c.status,
        property_id:c.property_id

      }))
      

    },
    propertyPart: async (_: any, { id }: { id: string }) => {const propertyPart= await getPropertyPartById(parseInt(id))
      return {
        id:propertyPart.id,
        name:propertyPart.part_name,
        status:propertyPart.status,
          property_id:propertyPart.property_id
      }
    },

    payments: async () => getAllInvoices(),
    payment: async (_: any, { id }: { id: string }) => getInvoiceById(parseInt(id)),
  },

  Organization: {
    contracts: async (parent: any) => {
        const contracts = (await getAllContracts()).filter((c:any) => c.organization_id === parent.id)
  
        
           return contracts.map((c: any) => ({
    endDate: c.end_date,
    startDate: c.start_date,
    property_part_id: c.property_part_id,
    property_id: c.property_id,
    organization_id: c.organization_id,
    tenant_ids: c.tenant_ids,
    id: c.id,
  }));

    }
   ,

    tenants: async (parent: any) => {
  const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id);

 
  const tenantIds = Array.from(
    new Set(contracts.flatMap((c: any) => c.tenant_ids))
  ) as string[]; 


  return Promise.all(tenantIds.map(id => getTenantById(parseInt(id))));
},

    properties: async (parent: any) => {
  const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id);


  const propertyIds = Array.from(
    new Set(contracts.map((c: any) => c.property_id))
  ) as number[]; 


  return Promise.all(propertyIds.map(id => getPropertyById(id)));
}
,

    payments: async (parent: any) => {
      const contracts = (await getAllContracts()).filter((c:any) => c.organization_id === parent.id);
      const payments = await getAllInvoices();
      const contractIds = contracts.map((c:any) => c.id);
   
      return payments.filter((p:any) => contractIds.includes(p.contract_id));
    },
    propertyPart: async (parent:any) =>{
      const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id);


 const propertyIds = [
  ...new Set(contracts.map((c: any) => c.property_id as number))
] as number[];

 const allPropertyParts = await getAllPropertyParts();

  
  const matchedPropertyParts = allPropertyParts.filter((pp: any) =>
    propertyIds.includes(pp.property_id)
  );



return matchedPropertyParts.map((pp: any) => ({
    id: pp.id,
    name: pp.part_name,
  }));

  




   

      
    }
  },

  Contract: {
    organization: async (parent: any) => getOrganizationById(parent.organization_id),
    tenants: async (parent: any) =>
      Promise.all(parent.tenant_ids.map((id: string) => getTenantById(parseInt(id)))),
    property: async (parent: any) => getPropertyById(parent.property_id),
    propertyPart: async (parent: any) =>
     {const propertyParts=await getPropertyPartById(parent.property_part_id)

      return {
        id:propertyParts.id,
        name:propertyParts.part_name
      }
      
     }, 
       
    payments: async (parent: any) => {
      const payments = await getAllInvoices();
      return payments.filter((p:any) => p.contract_id === parent.id);
    },
  },

  Tenant: {
    contracts: async (parent: any) => {
      const contracts = await getAllContracts()
      const contract = contracts.filter((c:any) => c.tenant_ids.includes(parent.id));

      return contract.map((c:any) =>( {
         endDate:c.end_date,
          startDate:c.start_date,
          id:c.id,
           organization_id:c.organization_id,
             property_part_id:c.property_part_id,
                property_id:c.property_id,
                     tenant_ids:c.tenant_ids

      }))
    },

    payments: async (parent: any) => {
      const payments = await getAllInvoices();
      return payments.filter((p:any) => p.tenant_id === parent.id);
    },

    organizations: async (parent: any) => {
  const contracts = await getAllContracts();

  // Get unique organization IDs for this tenant
  const orgIds = Array.from(
    new Set(
      contracts
        .filter((c: any) => Array.isArray(c.tenant_ids) && c.tenant_ids.includes(parent.id))
        .map((c: any) => c.organization_id)
    )
  ) as number[]; // <-- assert the correct type (number[] or string[] depending on your IDs)

  // Fetch organizations
  return Promise.all(orgIds.map(id => getOrganizationById(id)));
}
,
   properties: async (parent: any) => {
  const contracts = await getAllContracts();

  // Get unique property IDs for this tenant
  const propertyIds = Array.from(
    new Set(
      contracts
        .filter((c: any) => Array.isArray(c.tenant_ids) && c.tenant_ids.includes(parent.id))
        .map((c: any) => c.property_id)
    )
  ) as number[]; // <-- assert the correct type (number[] or string[] depending on your ID)

  // Fetch properties
  return Promise.all(propertyIds.map(id => getPropertyById(id)));
}
,
propertyPart: async (parent:any) =>{
      const invoices = (await getAllInvoices()).filter((c: any) => c.tenant_id === parent.id);


 const invoiceId = [
  ...new Set(invoices.map((c: any) => c.tenant_id as number))
] as number[];
 const allPropertyParts = await getAllPropertyParts();
 
  const matchedPropertyParts = allPropertyParts.filter((pp: any) =>
    invoiceId.includes(pp.property_id)
  );
return matchedPropertyParts.map((pp: any) => ({
    id: pp.id,
    name: pp.part_name,
  }));   
    }
  },

  Property: {
    contracts: async (parent: any) => {
    const contracts = await getAllContracts();

    return contracts
      .filter((c: any) => c.property_id === parent.id)
      .map((c: any) => ({
        ...c,

        // camelCase mapping
        endDate: c.end_date,
        startDate: c.start_date,

        // keep snake_case too if schema allows both
        organizationId: c.organization_id,
        propertyId: c.property_id,
        propertyPartId: c.property_part_id,
        tenantIds: c.tenant_ids,
      }));
  },

    propertyParts: async (parent: any) => {
      const parts = (await getAllPropertyParts()).filter((p:any) => p.property_id === parent.id);
 
      return parts.map((c:any) => (
        {
          id:c.id,
          name:c.part_name
        }
      ))
   
    },

    organization: async (parent: any) => {
      const contracts = await getAllContracts();
      const contract = contracts.find((c:any) => c.property_id === parent.id);
      return contract ? getOrganizationById(contract.organization_id) : null;
    },

   tenants: async (parent: any) => {
    const tenantParts=(await getAllTenantPropertyParts()).filter((c:any) => c.property_id === parent.id);
   
    const tenantById =await tenantParts.map(async (c:any) => await getTenantById(c.tenant_id))

 
    return tenantById;
    

}

,

    payments: async (parent: any) => {
      const contracts = await getAllContracts();
      const contractIds = contracts.filter((c:any) => c.property_id === parent.id).map((c:any) => c.id);
      const payments = await getAllInvoices();
      return payments.filter((p:any) => contractIds.includes(p.contract_id));
    },
  },

  PropertyPart: {
    contracts: async (parent: any) => {
      const contracts = (await getAllContracts()).filter((c:any) => c.property_part_id === parent.id);
      return contracts.map((c:any) =>({
           endDate:c.end_date,
           startDate:c.start_date,
           id:c.id,
              tenant_ids:c.tenant_ids,
            organization_id:   c.organization_id,
             property_id:c.property_id,
                 property_part_id:c.property_part_id


      }));
    },

    property: async (parent: any) => getPropertyById(Number(parent.property_id)),

    organization: async (parent: any) => {
      const contracts = await getAllContracts();
      const contract = contracts.find((c:any) => c.property_part_id === parent.id);
      return contract ? getOrganizationById(contract.organization_id) : null;
    },

    tenants:async (parent:any)=>{
      const contracts = (await getAllContracts())
      
      
      const relatedContracts = contracts.filter(
    (c: any) => c.property_part_id === parent.id
  );

 const tenantIds = relatedContracts
    .map((c: any) => c.tenant_ids)
    .flat();

     const tenants = await Promise.all(
    tenantIds.map((id: number) => getTenantById(id))
  );

    return tenants;
      


    },

    payments : async (parent:any) =>{
      const invoices = (await getAllInvoices()).filter((c:any) => c.property_part_id === parent.id)
      return invoices.map((c:any) => c)
    }
  
  },

  Invoice: {
    tenant: async (parent: any) => getTenantById(parent.tenant_id),
    contract: async (parent: any) =>
{const contracts=await getContractById(parent.contract_id)
  return {
    endDate:contracts.end_date,
      startDate:contracts.start_date,
      id:contracts.id,
      organization_id:contracts.organization_id,
      property_id:contracts.property_id,
      property_part_id:contracts.property_part_id,
      tenant_ids:contracts.tenant_ids
  }
},
    organization: async (parent: any) =>
      parent.contract_id ? getContractById(parent.contract_id).then(c => getOrganizationById(c.organization_id)) : null,
    property: async (parent: any) =>
      parent.contract_id ? getContractById(parent.contract_id).then(c => getPropertyById(c.property_id)) : null,

     propertyParts:async (parent:any) =>{
      const propertyPart = await getPropertyPartById(parent.property_part_id);
      // console.log(propertyPart);
      
     return[ {
      id:propertyPart.id,
      name:propertyPart.part_name,
      status:propertyPart.status,
      property_id:propertyPart.property_id
     }]
    },
  },
   
};
