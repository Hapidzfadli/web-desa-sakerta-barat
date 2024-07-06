import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

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
