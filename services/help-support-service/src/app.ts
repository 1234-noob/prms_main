import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import disputeRoutes from './routes/dispute.routes';
import maintenance from './routes/maintenance.routes';
import { requestLogger } from './middlewares/logger';
import contact from './routes/contact.routes'
import morgan from 'morgan';
import upload from './utils/fileUpload';
import path from 'path';
import fs from 'fs';
import { swaggerSpec, swaggerUi } from './swagger';


const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/disputes', disputeRoutes);
app.use('/maintenance', maintenance);
app.use('/contact', contact);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const filePath = path.join(__dirname, '../uploads', '1753945306863.jpg');
if (fs.existsSync(filePath)) {
    console.log('File exists:', filePath);
} else {
    console.log('File not found:', filePath);
}


// app.post('/dispute', upload.single('file'), async (req, res) => {
//     // Log the request body (form fields)
//     console.log("Request Body:", req.body);

//     // Log the uploaded file (file metadata)
//     console.log("Uploaded File:", req.file);

//     // Proceed with the rest of your logic or return response
//     res.status(200).json({
//         message: 'File uploaded successfully',
//         body: req.body,
//         file: req.file
//     });
// });

export default app;
