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
import httpRequest from "../../utils/axios";


const errorLoggingClient = httpRequest(process.env.ERROR_LOGGING_SERVICE_URL!)

export const allDataResolvers = {
  Query: {
    organizations: async () => {
      try {

        return await getAllOrganizations()
      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organizations Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
      }
    },
    organization: async (_: any, { id }: { id: string }) => {
      try {
        return await getOrganizationById(parseInt(id));
      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organization by id Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
      }
    },

    tenants: async () => {
      try {
        return await getAllTenants()

      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - tenants Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
      }
    },
    tenant: async (_: any, { id }: { id: string }) => {
      try {
        return await getTenantById(parseInt(id))

      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - tenants Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
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

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - contracts Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
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
        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - contract by id Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
      }
    },

    properties: async () => {
      try {
        return await getAllProperties()

      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - properties Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
      }
    },
    property: async (_: any, { id }: { id: string }) => {
      try {
        return await getPropertyById(parseInt(id))

      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - property by id Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
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
        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - Property Parts Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })


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
        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - Property Parts Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })

      }
    },

    payments: async () => {
      try {

        return await getAllInvoices()

      } catch (error: any) {
        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service -Invoice Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })


      }
    },
    payment: async (_: any, { id }: { id: string }) => {

      try {
        return await getInvoiceById(parseInt(id));

      } catch (error: any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - Invoice by id  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })

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

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organization(contract)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })

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

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organization(tenant)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })

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

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organization(property)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
        
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
        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organization(invoice)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
        
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
         await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - organization(property part)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
        
      }





    }
  },

  Contract: {
    organization: async (parent: any) => {
      try {
        return await getOrganizationById(parent.organization_id)
      } catch (error:any) {
        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - Contract(organization)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
      }
    },
    tenants: async (parent: any) =>
      {try {
       return Promise.all(parent.tenant_ids.map((id: string) => getTenantById(parseInt(id))))
        
      } catch (error:any) {

          await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - Contract(tenants)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
        
      }},
    property: async (parent: any) => {
      try {
       return await  getPropertyById(parent.property_id)
        
      } catch (error:any) {

        await errorLoggingClient.post("api/log-error", {
          origin: "Report And Analytics Service - Contract(tenants)  Query",
          message: error.message,
          stack: error.stack,
          statusCode: error.status || 500,
          meta: {

          }
        })
        
      }
    },
    propertyPart: async (parent: any) => {
      const propertyParts = await getPropertyPartById(parent.property_part_id)

      return {
        id: propertyParts.id,
        name: propertyParts.part_name
      }

    },

    payments: async (parent: any) => {
      const payments = await getAllInvoices();
      return payments.filter((p: any) => p.contract_id === parent.id);
    },
  },

  Tenant: {
    contracts: async (parent: any) => {
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
    },

    payments: async (parent: any) => {
      const payments = await getAllInvoices();
      return payments.filter((p: any) => p.tenant_id === parent.id);
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
    propertyPart: async (parent: any) => {
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
      const parts = (await getAllPropertyParts()).filter((p: any) => p.property_id === parent.id);

      return parts.map((c: any) => (
        {
          id: c.id,
          name: c.part_name
        }
      ))

    },

    organization: async (parent: any) => {
      const contracts = await getAllContracts();
      const contract = contracts.find((c: any) => c.property_id === parent.id);
      return contract ? getOrganizationById(contract.organization_id) : null;
    },

    tenants: async (parent: any) => {
      const tenantParts = (await getAllTenantPropertyParts()).filter((c: any) => c.property_id === parent.id);

      const tenantById = await tenantParts.map(async (c: any) => await getTenantById(c.tenant_id))


      return tenantById;


    }

    ,

    payments: async (parent: any) => {
      const contracts = await getAllContracts();
      const contractIds = contracts.filter((c: any) => c.property_id === parent.id).map((c: any) => c.id);
      const payments = await getAllInvoices();
      return payments.filter((p: any) => contractIds.includes(p.contract_id));
    },
  },

  PropertyPart: {
    contracts: async (parent: any) => {
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
    },

    property: async (parent: any) => getPropertyById(Number(parent.property_id)),

    organization: async (parent: any) => {
      const contracts = await getAllContracts();
      const contract = contracts.find((c: any) => c.property_part_id === parent.id);
      return contract ? getOrganizationById(contract.organization_id) : null;
    },

    tenants: async (parent: any) => {
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

    payments: async (parent: any) => {
      const invoices = (await getAllInvoices()).filter((c: any) => c.property_part_id === parent.id)
      return invoices.map((c: any) => c)
    }

  },

  Invoice: {
    tenant: async (parent: any) => getTenantById(parent.tenant_id),
    contract: async (parent: any) => {
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
    },
    organization: async (parent: any) =>
      parent.contract_id ? getContractById(parent.contract_id).then(c => getOrganizationById(c.organization_id)) : null,
    property: async (parent: any) =>
      parent.contract_id ? getContractById(parent.contract_id).then(c => getPropertyById(c.property_id)) : null,

    propertyParts: async (parent: any) => {
      const propertyPart = await getPropertyPartById(parent.property_part_id);
      // console.log(propertyPart);

      return [{
        id: propertyPart.id,
        name: propertyPart.part_name,
        status: propertyPart.status,
        property_id: propertyPart.property_id
      }]
    },
  },

};
