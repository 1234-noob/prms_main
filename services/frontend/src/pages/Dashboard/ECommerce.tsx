import PageMeta from "../../_nilesh/layout/component/common/PageMeta";
import DemographicCard from "../../_nilesh/layout/ecommerce/DemographicCard";
import EcommerceMetrics from "../../_nilesh/layout/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../_nilesh/layout/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../_nilesh/layout/ecommerce/MonthlyTarget";
import RecentOrders from "../../_nilesh/layout/ecommerce/RecentOrders";
import StatisticsChart from "../../_nilesh/layout/ecommerce/StatisticsChart";

export default function Ecommerce() {
  return (
    <>
      {/* <PageMeta
        title="Property Rent Management"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
