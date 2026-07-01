import { optimizeImg } from './imageOptimizer';
import supabase from './supabase';

/**
 * Uploads an asset (image or pdf) to Supabase Storage.
 * Automatically ensures images are optimized before uploading.
 * 
 * @param {Object} params 
 * @param {File} params.file The file to upload
 * @param {string} params.bucket_name The Supabase bucket name
 * @param {string} params.sku The base name/path for the file in storage
 * @returns {Promise<{ filePaths: string[], error: any, fileType: string }>}
 */
export const uploadAsset = async ({ file, bucket_name, sku }) => {
  try {
    let uploadFile = file;
    let ext = file.name.split('.').pop().toLowerCase();
    let contentType = file.type;
    let fileType = 'document'; // default

    // If it's an image, optimize it to WEBP
    if (file.type.startsWith('image/')) {
      uploadFile = await optimizeImg(file);
      ext = 'webp';
      contentType = 'image/webp';
      fileType = 'image';
    } else if (file.type === 'application/pdf') {
      fileType = 'pdf';
    } else {
      throw new Error('Unsupported file type. Please upload an image or PDF.');
    }

    // 1.5. Check File Size (must be < 1MB)
    const MAX_SIZE_MB = 1;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    
    if (uploadFile.size > MAX_SIZE_BYTES) {
      const actualSizeMB = (uploadFile.size / (1024 * 1024)).toFixed(2);
      throw new Error(`File is too large (${actualSizeMB}MB). Maximum allowed size is ${MAX_SIZE_MB}MB.`);
    }

    // 2. Prepare Storage Path
    const uniqueId = Date.now();
    // Sanitizing sku to avoid path traversal or weird characters
    const safeSku = sku.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${safeSku}_${uniqueId}.${ext}`;

    // 3. Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket_name)
      .upload(filePath, uploadFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType,
      });

    if (error) {
      throw error;
    }

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket_name)
      .getPublicUrl(filePath);

    return { filePaths: [publicUrl], error: null, fileType };
  } catch (error) {
    console.error("Upload Asset Error:", error);
    return { filePaths: null, error, fileType: null };
  }
};
