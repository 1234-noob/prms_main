import { log } from "console";
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
import { logError } from "../../helper/logError";




export const allDataResolvers = {
  Query: {
    organizations: async () => {
      try {

        return await getAllOrganizations()
      } catch (error: any) {
        await logError("Report And Analytics Service - organizations Query", error)

        
      }
    },
    organization: async (_: any, { id }: { id: string }) => {
      try {
        return await getOrganizationById(parseInt(id));
      } catch (error: any) {
await logError("Report And Analytics Service - organization by id Query", error)
        
      }
    },

    tenants: async () => {
      try {
        return await getAllTenants()

      } catch (error: any) {

        await logError("Report And Analytics Service - tenants Query", error)
        
      }
    },
    tenant: async (_: any, { id }: { id: string }) => {
      try {
        return await getTenantById(parseInt(id))

      } catch (error: any) {
        await logError("Report And Analytics Service - tenant by id Query", error)
        
      }
    },

    contracts: async () => {
      try {
        const contracts = await getAllContracts()
        return contracts.map((c: any) => ({
          endDate: c.end_date,
          startDate: c.start_date,
          property_part_id: c.property_part_id,
          property_id: c.property_id,
          organization_id: c.organization_id,
          tenant_ids: c.tenant_ids,
          id: c.id,
        }));
      } catch (error: any) {
        await logError("Report And Analytics Service - contracts Query", error)
        
      }
    },
    contract: async (_: any, { id }: { id: string }) => {
      try {
        const contractById = await getContractById(parseInt(id))
        return {
          endDate: contractById.end_date,
          startDate: contractById.start_date,
          property_part_id: contractById.property_part_id,
          property_id: contractById.property_id,
          organization_id: contractById.organization_id,
          tenant_ids: contractById.tenant_ids,
          id: contractById.id,
        } 
      }
      catch (error: any) {
        await logError("Report And Analytics Service - contract by id Query", error)
        
      }
    },

    properties: async () => {
      try {
        return await getAllProperties()

      } catch (error: any) {
        await logError("Report And Analytics Service - properties Query", error)

        
      }
    },
    property: async (_: any, { id }: { id: string }) => {
      try {
        return await getPropertyById(parseInt(id))

      } catch (error: any) {

        await logError("Report And Analytics Service - property by id Query", error)  
        
      }
    },

    propertyParts: async () => {
      try {
        const propertyParts = await getAllPropertyParts()
        return propertyParts.map((c: any) => ({
          id: c.id,
          name: c.part_name,
          status: c.status,
          property_id: c.property_id

        }))

      } catch (error: any) {

        await logError("Report And Analytics Service - property parts Query", error)
        

      }


    },
    propertyPart: async (_: any, { id }: { id: string }) => {
      try {
        const propertyPart = await getPropertyPartById(parseInt(id))
        return {
          id: propertyPart.id,
          name: propertyPart.part_name,
          status: propertyPart.status,
          property_id: propertyPart.property_id
        }
      } catch (error: any) {
        await logError("Report And Analytics Service - property part by id Query", error)
        

      }
    },

    payments: async () => {
      try {

        return await getAllInvoices()

      } catch (error: any) {

        await logError("Report And Analytics Service - invoices Query", error)
        


      }
    },
    payment: async (_: any, { id }: { id: string }) => {

      try {
        return await getInvoiceById(parseInt(id));

      } catch (error: any) {

        await logError("Report And Analytics Service - invoice by id Query", error)

        
      }


    },
  },

  Organization: {
    contracts: async (parent: any) => {
      try {
        const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id)


        return contracts.map((c: any) => ({
          endDate: c.end_date,
          startDate: c.start_date,
          property_part_id: c.property_part_id,
          property_id: c.property_id,
          organization_id: c.organization_id,
          tenant_ids: c.tenant_ids,
          id: c.id,
        }));

      } catch (error: any) {
        await logError("Report And Analytics Service - organization(contracts) Query", error)

       

      }

    }
    ,

    tenants: async (parent: any) => {
      try {
        const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id);


        const tenantIds = Array.from(
          new Set(contracts.flatMap((c: any) => c.tenant_ids))
        ) as string[];


        return Promise.all(tenantIds.map(id => getTenantById(parseInt(id))));

      } catch (error: any) {
        await logError("Report And Analytics Service - organization(tenants) Query", error)
        

      }
    },

    properties: async (parent: any) => {
      try {
              const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id);


      const propertyIds = Array.from(
        new Set(contracts.map((c: any) => c.property_id))
      ) as number[];


      return Promise.all(propertyIds.map(id => getPropertyById(id)));

      } catch (error:any) {
        await logError("Report And Analytics Service - organization(properties) Query", error)

        
        
      }

    }
    ,

    payments: async (parent: any) => {
      try {
        const contracts = (await getAllContracts()).filter((c: any) => c.organization_id === parent.id);
      const payments = await getAllInvoices();
      const contractIds = contracts.map((c: any) => c.id);

      return payments.filter((p: any) => contractIds.includes(p.contract_id));
        
      } catch (error:any) {
       await logError("Report And Analytics Service - organization(payments) Query", error)
       
      }
    },
    propertyPart: async (parent: any) => {
      
      try {
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




        
      } catch (error:any) {
        await logError("Report And Analytics Service - organization(property part)  Query", error)
         
        
      }





    }
  },

  Contract: {
    organization: async (parent: any) => {
      try {
        return await getOrganizationById(parent.organization_id)
      } catch (error:any) {
        await logError("Report And Analytics Service - Contract(organization)  Query", error)
        
      }
    },
    tenants: async (parent: any) =>
      {try {
       return Promise.all(parent.tenant_ids.map((id: string) => getTenantById(parseInt(id))))
        
      } catch (error:any) {
        await logError("Report And Analytics Service - Contract(tenants)  Query", error)

         
        
      }},
    property: async (parent: any) => {
      try {
       return await  getPropertyById(parent.property_id)
        
      } catch (error:any) {

        await logError("Report And Analytics Service - Contract(property)  Query", error)

      }
    },
    propertyPart: async (parent: any) => {
      try {
        const propertyParts = await getPropertyPartById(parent.property_part_id)

      return {
        id: propertyParts.id,
        name: propertyParts.part_name
      }
        
      } catch (error) {
        await logError("Report And Analytics Service - Contract(property part)  Query", error)
        
      }

    },

    payments: async (parent: any) => {
      try {
        const payments = await getAllInvoices();
      return payments.filter((p: any) => p.contract_id === parent.id);
        
      } catch (error) {
        await logError("Report And Analytics Service - Contract(payments)  Query", error)
        
      }
    },
  },

  Tenant: {
    contracts: async (parent: any) => {
      try {

        const contracts = await getAllContracts()
      const contract = contracts.filter((c: any) => c.tenant_ids.includes(parent.id));

      return contract.map((c: any) => ({
        endDate: c.end_date,
        startDate: c.start_date,
        id: c.id,
        organization_id: c.organization_id,
        property_part_id: c.property_part_id,
        property_id: c.property_id,
        tenant_ids: c.tenant_ids

      }))
        
      } catch (error) {
        await logError("Report And Analytics Service - tenant(contracts) Query", error)
        
      }
    },

    payments: async (parent: any) => {
try {
        const payments = await getAllInvoices();
      return payments.filter((p: any) => p.tenant_id === parent.id);
  
} catch (error) {
  await logError("Report And Analytics Service - tenant(payments) Query", error)
  
}
    },

    organizations: async (parent: any) => {
try {
        const contracts = await getAllContracts();  
      const orgIds = Array.from(
        new Set(
          contracts
            .filter((c: any) => Array.isArray(c.tenant_ids) && c.tenant_ids.includes(parent.id))
            .map((c: any) => c.organization_id)
        )
      ) as number[];
     return Promise.all(orgIds.map(id => getOrganizationById(id)));
  
} catch (error) {
  await logError("Report And Analytics Service - tenant(organizations) Query", error)
  
}
    }
    ,
    properties: async (parent: any) => {
      const contracts = await getAllContracts();

  
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
    propertyPart: async (parent: any) => {
      try {
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
        
      } catch (error) {
        await logError("Report And Analytics Service - tenant(property part) Query", error)
        
      }
    }
  },

  Property: {
    contracts: async (parent: any) => {
     try {
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
      
     } catch (error) {
      await logError("Report And Analytics Service - Property(contracts) Query", error)
      
     }
    },

    propertyParts: async (parent: any) => {
 try {
       const parts = (await getAllPropertyParts()).filter((p: any) => p.property_id === parent.id);

      return parts.map((c: any) => (
        {
          id: c.id,
          name: c.part_name
        }
      ))
 } catch (error) {
  await logError("Report And Analytics Service - Property(property parts) Query", error)
  
 }

    },

    organization: async (parent: any) => {
     try {
       const contracts = await getAllContracts();
      const contract = contracts.find((c: any) => c.property_id === parent.id);
      return contract ? getOrganizationById(contract.organization_id) : null;
     } catch (error) {
      await logError("Report And Analytics Service - Property(organization) Query", error)
      
     }
    },

    tenants: async (parent: any) => {
try {
        const tenantParts = (await getAllTenantPropertyParts()).filter((c: any) => c.property_id === parent.id);

      const tenantById = await tenantParts.map(async (c: any) => await getTenantById(c.tenant_id))


      return tenantById;


  
} catch (error) {
  await logError("Report And Analytics Service - Property(tenants) Query", error)
  
}
    } ,

    payments: async (parent: any) => {
      try {
            const contracts = await getAllContracts();
      const contractIds = contracts.filter((c: any) => c.property_id === parent.id).map((c: any) => c.id);
      const payments = await getAllInvoices();
      return payments.filter((p: any) => contractIds.includes(p.contract_id));
        
      } catch (error) {
        await logError("Report And Analytics Service - Property(payments) Query", error)
        
      }
  
    },
  },

  PropertyPart: {
    contracts: async (parent: any) => {
      try {
        const contracts = (await getAllContracts()).filter((c: any) => c.property_part_id === parent.id);
      return contracts.map((c: any) => ({
        endDate: c.end_date,
        startDate: c.start_date,
        id: c.id,
        tenant_ids: c.tenant_ids,
        organization_id: c.organization_id,
        property_id: c.property_id,
        property_part_id: c.property_part_id


      }));
        
      } catch (error) {
        await logError("Report And Analytics Service - property part(contracts) Query", error)
      }
    },

    property: async (parent: any) => {
      try {
       return await getPropertyById(Number(parent.property_id))
      } catch (error) {
        await logError("Report And Analytics Service - property part(property) Query", error)
      }
    },

    organization: async (parent: any) => {
      try {
             const contracts = await getAllContracts();
      const contract = contracts.find((c: any) => c.property_part_id === parent.id);
      return contract ? getOrganizationById(contract.organization_id) : null;
        
      } catch (error) {
        await logError("Report And Analytics Service - property part(organization) Query", error)
        
      }
    },

    tenants: async (parent: any) => {
      try {
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


        
      } catch (error) {
        
        await logError("Report And Analytics Service - property part(tenants) Query", error)  
      }

    },

    payments: async (parent: any) => {
     try {
       const invoices = (await getAllInvoices()).filter((c: any) => c.property_part_id === parent.id)
      return invoices.map((c: any) => c)
      
     } catch (error) {
      await logError("Report And Analytics Service - property part(payments) Query", error)
      
     }
    }

  },

  Invoice: {
    tenant: async (parent: any) => {
      try {
        return await getTenantById(parent.tenant_id)
        
      } catch (error) {
        
        await logError("Report And Analytics Service - Invoice(tenant) Query", error)
      }
    },
    contract: async (parent: any) => {
      try {

        const contracts = await getContractById(parent.contract_id)
      return {
        endDate: contracts.end_date,
        startDate: contracts.start_date,
        id: contracts.id,
        organization_id: contracts.organization_id,
        property_id: contracts.property_id,
        property_part_id: contracts.property_part_id,
        tenant_ids: contracts.tenant_ids
      }
        
      } catch (error) {
        await logError("Report And Analytics Service - Invoice(contract) Query", error)
      }
    },
    organization: async (parent: any) =>
  {
    try {
    return  parent.contract_id ? getContractById(parent.contract_id).then(c => getOrganizationById(c.organization_id)) : null
    } catch (error) {
      
await logError("Report And Analytics Service - Invoice(organization) Query", error)
    }
  },
    property: async (parent: any) =>
    {
      try {
       return   parent.contract_id ? getContractById(parent.contract_id).then(c => getPropertyById(c.property_id)) : null

      } catch (error) {
        await logError("Report And Analytics Service - Invoice(property) Query", error)
        
      }
    },

    propertyParts: async (parent: any) => {
     try {
       const propertyPart = await getPropertyPartById(parent.property_part_id);
      // console.log(propertyPart);

      return [{
        id: propertyPart.id,
        name: propertyPart.part_name,
        status: propertyPart.status,
        property_id: propertyPart.property_id
      }]

     } catch (error) {
      await logError("Report And Analytics Service - Invoice(property part) Query", error)  
      
     }
    },
  },

};
