import { useState, useEffect } from "react";
import { getOrganizationById, updateOrganization } from "../core/_requests";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: number;
    onOrganizationUpdated: () => void;
}

const EditOrganizationModal: React.FC<ModalProps> = ({ isOpen, onClose, organizationId, onOrganizationUpdated }) => {
    const [organization, setOrganization] = useState({ name: "", address: "", email: "", contactNo: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch Organization details when the modal opens
    useEffect(() => {
        if (isOpen && organizationId !== 0) {
            fetchOrganizationDetails();
        }
    }, [isOpen, organizationId]);

    const fetchOrganizationDetails = async () => {
        try {
            setLoading(true);
            const data = await getOrganizationById(organizationId);
            console.log(organizationId);
            setOrganization(data);  // Fill input fields with fetched data
        } catch (err) {
            setError("Failed to fetch organization details.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Update
    const handleUpdate = async () => {
        if (!organization.name || !organization.address) {
            setError("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
            await updateOrganization(organizationId, organization);
            onOrganizationUpdated(); // Refresh organization list
            onClose(); // Close modal
        } catch (err) {
            setError("Failed to update organization.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setOrganization({ name: "", address: "", email: "", contactNo: "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                    {/* Close Button */}
                    <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-xl font-semibold mb-4 border-b pb-4">Edit Organization</h2>

                    {error && <p className="text-red-500">{error}</p>}
                    {/* <div className='flex space-x-4'> */}
                        {/* <div className='flex-1'> */}
                            <label className="text-slate-900 text-md block mb-1">Organization Name</label>
                            <input
                                type="text"
                                value={organization.name}
                                onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                                className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                            />

                            <label className="text-slate-900 text-md block mb-1">Location</label>
                            <input
                                type="text"
                                value={organization.address}
                                onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                                className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                            />
                        {/* </div> */}
                        {/* <div className='flex-1'> */}
                            <label className="text-slate-900 text-md block mb-1">Email</label>
                            <input
                                type="text"
                                value={organization.email}
                                onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                                className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                            />

                            <label className="text-slate-900 text-md block mb-1">Contact No.</label>
                            <input
                                type="number"
                                value={organization.contactNo}
                                onChange={(e) => setOrganization({ ...organization, contactNo: e.target.value })}
                                className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                            />
                        {/* </div> */}
                    {/* </div> */}


                    {/* Update Button */}
                    <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleUpdate} disabled={loading}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default EditOrganizationModal;
