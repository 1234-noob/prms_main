import React, { FC, useState } from 'react';

interface HierarchyItem {
    id: number;
    name: string;
    level: number;
}

const HierarchyManagement: FC = () => {
    const [hierarchyList, setHierarchyList] = useState<HierarchyItem[]>([
        { id: 1, name: 'Building', level: 1 },
        { id: 2, name: 'Unit', level: 2 },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedName, setSelectedName] = useState<string>('');
    const [editId, setEditId] = useState<number | null>(null); // null = add mode

    const itemsPerPage = 2;
    const totalPages = Math.ceil(hierarchyList.length / itemsPerPage);

    const currentItems = hierarchyList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const HierarchyOptions = [
        { id: 'building', label: 'Building' },
        { id: 'unit', label: 'Unit' },
    ];

    const openAddModal = () => {
        setSelectedName('');
        setEditId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: HierarchyItem) => {
        setSelectedName(item.name);
        setEditId(item.id);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!selectedName) return;

        if (editId !== null) {
            // Update existing
            const updated = hierarchyList.map(item =>
                item.id === editId ? { ...item, name: selectedName } : item
            );
            setHierarchyList(updated);
        } else {
            // Add new
            const newItem: HierarchyItem = {
                id: Date.now(),
                name: selectedName,
                level: hierarchyList.length + 1,
            };
            setHierarchyList([...hierarchyList, newItem]);
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        const filtered = hierarchyList.filter(item => item.id !== id);
        // Reassign levels after delete
        const reassigned = filtered.map((item, idx) => ({
            ...item,
            level: idx + 1,
        }));
        setHierarchyList(reassigned);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex justify-center">
            <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                <h2 className="text-xl text-[#3248d6] font-semibold p-6">Hierarchy</h2>

                <div className="mb-3 px-6 flex justify-end">
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Add
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className='bg-blue-50 shadow-inner '>
                            <tr className="text-left text-slate-600 text-sm border-b border-slate-100 tracking-wide">
                                <th className="ps-6 font-normal">NAME</th>
                                <th className="p-3 font-normal">LEVEL</th>
                                <th className="p-3 font-normal"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-gray-50">
                                    <td className="ps-6 font-medium text-slate-600">{item.name}</td>
                                    <td className="p-3 text-slate-600 font-light">{item.level}</td>
                                    <td className="p-3">
                                        <div className='flex items-center space-x-4'>
                                            {/* Edit Button */}
                                            <button className="text-[#465FFF] hover:text-[#364FCC] flex items-center"
                                                onClick={() => openEditModal(item)}
                                                title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                            </button>
                                            {/* Delete (Trash) Button */}
                                            <button className="text-[#e33a3a] hover:text-[rgb(220,76,76)] flex items-center h-6 w-6">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fb6a6a"
                                                    onClick={() => handleDelete(item.id)}>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path d="M9 5C9 3.895 9.895 3 11 3H13C14.105 3 15 3.895 15 5V7H9V5Z"
                                                            stroke="#fb6a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M4 7H20"
                                                            stroke="#fb6a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6 10L7.7 19.35C7.87 20.3 8.7 21 9.67 21H14.33C15.3 21 16.13 20.3 16.3 19.35L18 10"
                                                            stroke="#fb6a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9 10V18M12 10V18M15 10V18"
                                                            stroke="rgba(251, 106, 106, 0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-end items-center space-x-2 mt-4 mr-6">
                        <button
                            className="px-3 py-1 border rounded-full disabled:opacity-50"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-3 py-1 border rounded-full ${currentPage === index + 1 ? "bg-blue-500 text-white" : ""}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 border rounded-full disabled:opacity-50"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-semibold mb-4">{editId ? "Edit" : "Add"} Hierarchy</h2>
                            <label className='text-slate-900 text-md block mb-1'>Hierarchy Name</label>
                            <select
                                value={selectedName}
                                onChange={(e) => setSelectedName(e.target.value)}
                                className="w-full px-2 py-2 mb-4 border border-slate-300 rounded-lg"
                            >
                                <option value="">Select</option>
                                {HierarchyOptions.map((h) => (
                                    <option key={h.id} value={h.label}>{h.label}</option>
                                ))}
                            </select>
                            <div className="flex justify-end">
                                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
                                    {editId ? "Update" : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HierarchyManagement;
