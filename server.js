const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, 'uploads');
const portfolioFile = path.join(__dirname, 'portfolio_data.json');
const allowedImageTypes = new Map([
    ['image/jpeg', '.jpg'],
    ['image/png', '.png'],
    ['image/gif', '.gif'],
    ['image/webp', '.webp']
]);

fs.mkdirSync(uploadDir, { recursive: true });

app.use((req, res, next) => {
    const origin = req.get('origin');
    const serverOrigin = `${req.protocol}://${req.get('host')}`;
    if (origin && origin !== serverOrigin) {
        return res.status(403).json({ success: false, message: 'Cross-origin requests are not allowed.' });
    }
    next();
});
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadDir));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${allowedImageTypes.get(file.mimetype)}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (!allowedImageTypes.has(file.mimetype)) {
            return cb(new Error('Upload a JPEG, PNG, GIF, or WebP image.'));
        }
        cb(null, true);
    }
});

app.post('/api/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

app.post('/api/portfolio/save', async (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ success: false, message: 'Portfolio data must be a JSON object.' });
    }

    try {
        await fs.promises.writeFile(portfolioFile, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true, message: 'Portfolio saved successfully!' });
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error instanceof multer.MulterError) {
        const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({ success: false, message: error.message });
    }

    if (error.message === 'Upload a JPEG, PNG, GIF, or WebP image.') {
        return res.status(400).json({ success: false, message: error.message });
    }

    console.error('Request failed:', error);
    res.status(500).json({ success: false, message: 'The server could not complete the request.' });
});

app.listen(PORT, () => {
    console.log(`Portfolio backend server running at http://localhost:${PORT}`);
});
