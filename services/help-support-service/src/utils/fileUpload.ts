import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);  // Store files in the 'uploads/' folder
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;  // Use timestamp to avoid conflicts
        cb(null, filename);
    }
});

// File filter for allowed file types
const fileFilter = (req: any, file: any, cb: any) => {
    console.log("Uploaded File MIME Type:", file.mimetype);  // Log the MIME type of the uploaded file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Allow the file
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.'));
    }
};

// Set up Multer for file uploads
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
});

export default upload;
