/**
 * Optimizes an image.
 * - Max width: 800px (auto height)
 * - Format: WebP
 * - Quality: 0.8 for great size reduction without heavy degradation.
 * 
 * @param {File} file 
 * @returns {Promise<File>} The optimized file with a flag `fhhf_optimized` set to true.
 */
export const optimizeImg = async (file) => {
  // Return immediately if already optimized
  if (file.fhhf_optimized) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Auto-scale to max-width 800px
        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob failed'));
              return;
            }
            
            // Generate a new File from the Blob
            const optimizedFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const optimizedFile = new File([blob], optimizedFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            
            // Idempotency flag
            optimizedFile.fhhf_optimized = true;
            resolve(optimizedFile);
          },
          'image/webp',
          0.8
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
