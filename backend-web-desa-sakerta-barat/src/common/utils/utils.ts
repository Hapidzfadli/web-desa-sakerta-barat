import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

export async function uploadFileAndGetUrl(
  file: Express.Multer.File,
  uploadDir: string = 'uploads/private',
  urlPrefix: string = '/api/users/profile-picture',
): Promise<string> {
  const fullUploadDir = path.join(process.cwd(), uploadDir);
  await fs.mkdir(fullUploadDir, { recursive: true });

  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(fullUploadDir, fileName);

  await fs.writeFile(filePath, file.buffer);
  return `${urlPrefix}/${fileName}`;
}

// Helper function to convert SVG to PNG (placeholder implementation)
export function svgToPng(svgString: string): Buffer {
  return Buffer.from(svgString);
}

export async function dataUrlToBuffer(dataUrl: string): Promise<Buffer> {
  const data = dataUrl.split(',')[1];
  const buffer = Buffer.from(data, 'base64');
  return sharp(buffer).png().toBuffer();
}
