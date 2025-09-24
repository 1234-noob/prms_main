import React, { FC, useState } from 'react';

interface ImageViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
}

const ImageViewModal: FC<ImageViewModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
}) => {
    const [imageError, setImageError] = useState(false);

    if (!isOpen || !imageUrl) return null;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100002] font-sans">
            <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-3xl max-h-[90vh] overflow-hidden">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                    aria-label="Close image view"
                >
                    &#10005;
                </button>
                {imageError ? (
                    <div className="flex items-center justify-center h-full w-full p-10 text-gray-500">
                        <p>Failed to load image. Please check the file.</p>
                    </div>
                ) : (
                    <img
                        src={imageUrl}
                        alt="Dispute Attachment"
                        className="max-w-full max-h-[85vh] object-contain mx-auto"
                        onError={handleImageError}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageViewModal;