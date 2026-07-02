import multer from "multer";
import cloudinary from "../configs/cloudinary.config.js";
import { ApiError } from "../utils/apiError.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      return cb(
        new ApiError(
          400,
          `Định dạng ảnh không được hỗ trợ: ${file.mimetype}. Chỉ chấp nhận jpeg, png, gif, webp, svg.`,
        ),
      );
    }
    cb(null, true);
  },
});

const uploadBufferToCloudinary = (fileBuffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });

const uploadTicketImages = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      memoryUpload.array("images", MAX_FILES)(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return reject(
                new ApiError(
                  400,
                  `Kích thước mỗi ảnh không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                ),
              );
            }
            if (err.code === "LIMIT_FILE_COUNT") {
              return reject(
                new ApiError(400, `Chỉ được gửi tối đa ${MAX_FILES} ảnh`),
              );
            }
            return reject(new ApiError(400, err.message));
          }
          return reject(err);
        }
        resolve();
      });
    });

    if (!req.files || req.files.length === 0) {
      req.uploadedImages = [];
      return next();
    }

    const folder = "supporthub/tickets";
    const uploadResults = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer, folder)),
    );

    req.uploadedImages = req.files.map((file, index) => ({
      fileName: file.originalname,
      fileUrl: uploadResults[index].secure_url,
      fileSize: file.size,
      mimeType: file.mimetype,
    }));

    next();
  } catch (error) {
    next(error);
  }
};

export { uploadTicketImages };
