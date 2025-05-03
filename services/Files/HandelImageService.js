const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const uploadDir = path.join(__dirname,'..', '..', 'storage', 'uploads');
ensureDirExists(uploadDir);
// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),

    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${timestamp}-${random}${ext}`);
    }

});


// File type filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPEG, PNG, JPG, or WEBP image files are allowed.'));
    }
    cb(null, true);
};

// Export upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});

//extract image path to save only path
const getRelativeUploadPath = (absolutePath) => {
    const basePath = path.join(__dirname, '..', '..');
    return path.relative(basePath, absolutePath).replace(/\\/g, '/');
};

// Delete old image if it exists
const deleteImageIfExists = (relativePath) => {
    if (!relativePath) return;

    const fullPath = path.join(__dirname, '..', '..', relativePath);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
            if (err) console.error('Failed to delete old image:', err);
        });
    }
};


module.exports = { upload,getRelativeUploadPath,deleteImageIfExists};
