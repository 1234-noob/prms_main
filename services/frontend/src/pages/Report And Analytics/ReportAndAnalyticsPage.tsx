import { ReportsTable } from './components/ReportTable';

import { useState } from "react";
import { Filter } from "lucide-react";

const ReportAndAnalyticsPage = () => {

      const [open, setOpen] = useState(false);
       const [openProperty, setOpenProperty] = useState(false);

  const toggleDropdown = () => setOpen(!open);  
    const toggleDropdownPropertyFilter = () => setOpenProperty(!openProperty);  
  return (
    
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Reports</h2>
                    <div className='mb-3 px-6 flex justify-between'>
                        <div className='border border-gray-300 rounded-md p-1'>
                            <div className='flex justify-center space-x-1'>
                               
                                <div className="relative w-48 max-w-xs sm:w-[400px]">
                                   
                               
                                            {/* Search Icon */}
                                            <svg
                                                className="absolute left-2 top-2.5 text-gray-500 w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                                ></path>
                                            </svg>
                                            {/* Search Input */}
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                               
                                                className="w-full pl-10 pr-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-sm"
                                            />
                                    
                                 
                                </div>
                            </div>

                             
                        </div>
                        <div className='flex space-x-6'>
                        <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdownPropertyFilter}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        <Filter size={18} />
        Property Filter
      </button>

      {openProperty && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
          <ul className="py-2 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Property Id</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Name</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Location</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Organization</li>
          </ul>
        </div>
      )}
    </div>
                           
                             <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-6 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100 transition"
      >
        <Filter size={18} />
        Filter
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          <ul className="py-2 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Newest</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Oldest</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Status: Active</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Status: Inactive</li>
          </ul>
        </div>
      )}
    </div>
                        </div>
                  

                </div>

                    <ReportsTable />
            </div>
      </div>

      
    );
}

export default ReportAndAnalyticsPage
