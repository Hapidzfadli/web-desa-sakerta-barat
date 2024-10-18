import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ResidentData {
  id: number;
  nationalId: string;
  name: string;
  dateOfBirth: Date;
}

interface LetterRequest {
  id: number;
  letterNumber: string;
  letterTypeId: number;
  resident: ResidentData;
}

export async function generateSecureQRCode(
  letterRequest: LetterRequest,
  kadesId: number,
): Promise<string> {
  if (!letterRequest || !letterRequest.resident) {
    throw new Error('Invalid letter request data');
  }

  const payload = {
    lr: letterRequest.id,
    ln: letterRequest.letterNumber,
    rd: {
      name: letterRequest.resident.name,
      nik: letterRequest.resident.nationalId,
      dob: letterRequest.resident.dateOfBirth.toISOString().split('T')[0],
    },
    ts: Date.now(),
  };

  const payloadString = JSON.stringify(payload);
  const hash = generateHash(payloadString);

  // Combine the payload and hash
  const qrData = JSON.stringify({ ...payload, hash });

  await prisma.signature.create({
    data: {
      letterRequestId: letterRequest.id,
      kadesId,
      hash,
      payload: payloadString,
    },
  });

  return QRCode.toDataURL(qrData);
}

export async function verifyQRCode(scannedData: string): Promise<{
  isValid: boolean;
  data?: {
    letterRequestId: number;
    letterNumber: string;
    residentName: string;
    residentNIK: string;
    residentDOB: string;
    timestamp: number;
  };
}> {
  try {
    const { lr, ln, rd, ts, hash } = JSON.parse(scannedData);
    const reconstructedPayload = JSON.stringify({ lr, ln, rd, ts });
    const regeneratedHash = generateHash(reconstructedPayload);

    if (regeneratedHash !== hash) {
      return { isValid: false };
    }

    const signature = await prisma.signature.findFirst({
      where: { hash: hash },
    });

    if (!signature) {
      return { isValid: false };
    }

    return {
      isValid: true,
      data: {
        letterRequestId: lr,
        letterNumber: ln,
        residentName: rd.name,
        residentNIK: rd.nik,
        residentDOB: rd.dob,
        timestamp: ts,
      },
    };
  } catch (error) {
    console.error('Error verifying QR code:', error);
    return { isValid: false };
  }
}

function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
