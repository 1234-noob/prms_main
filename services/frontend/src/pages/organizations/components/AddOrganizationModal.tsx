import { useState } from "react";
import axios from "axios";
import { createOrganization } from "../core/_requests";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrganizationAdded: () => void;
}

const AddOrganizationModal: React.FC<ModalProps> = ({ isOpen, onClose, onOrganizationAdded }) => {
    const [organizationName, setOrganizationName] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!organizationName || !location) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            
            const response = await createOrganization({ name: organizationName, address: location, email: email, contactNo: contactNo });

            console.log("Organization Created:", response.data);

            // Notify parent component to refresh the table
            onOrganizationAdded();

            // Clear form & close modal
            setOrganizationName("");
            setLocation("");
            onClose();
        } catch (error) {
            console.error("Error creating organization:", error);
            setError("Failed to create organization");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOrganizationName("");
        setLocation("");
        setError("");
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                {/* Close Icon */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Organization</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {/* <div className='flex space-x-4'>
                    <div className='flex-1'> */}
                        <label className='text-slate-900 text-md block mb-1'>Organization Name</label>
                        <input
                            type="text"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    {/* </div> */}
                    {/* <div className='flex-1'> */}
                        <label className='text-slate-900 text-md block mb-1'>Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    {/* </div> */}
                {/* </div> */}

                {/* <div className='flex space-x-4'> */}
                    {/* <div className='flex-1'> */}
                        <label className='text-slate-900 text-md block mb-1'>Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    {/* </div> */}
                    {/* <div className='flex-1'> */}
                        <label className='text-slate-900 text-md block mb-1'>Contact No</label>
                        <input
                            type="text"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    {/* </div> */}
                {/* </div> */}


                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddOrganizationModal;
