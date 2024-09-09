import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrashCan,
  faEye,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { LetterType } from '../types/letterType.types';
import LoadingSpinner from '../../shared/LoadingSpinner';

interface LetterTypeCardProps {
  letterType: LetterType;
  userRole: string;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onApply: () => void;
  isLoading?: boolean;
}

const LetterTypeCard: React.FC<LetterTypeCardProps> = ({
  letterType,
  userRole,
  onEdit,
  onDelete,
  onView,
  onApply,
  isLoading,
}) => {
  if (isLoading) return <LoadingSpinner />;
  return (
    <Card
      className={`flex flex-col relative ${letterType.icon ? 'h-96' : 'h-44'}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-black-2">
          {letterType.name}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`relative ${letterType.icon ? 'grow' : 'flex-none'}`}
      >
        {letterType.icon && (
          <div className="h-40 mb-4 rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${letterType.icon}`}
                layout="fill"
                objectFit="cover"
                alt={letterType.name}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        <CardDescription className="text-[#A3AED0]">
          {letterType.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 relative">
        {userRole !== 'WARGA' ? (
          <>
            <Button
              className="bg-delete hover:bg-red-600 h-8 w-8 rounded-full p-0"
              title="Hapus"
              onClick={onDelete}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faTrashCan}
              />
            </Button>
            <Button
              className="bg-edit hover:bg-yellow-500 h-8 w-8 rounded-full p-0"
              title="Edit"
              onClick={onEdit}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPenToSquare}
              />
            </Button>
            <Button
              className="bg-view hover:bg-blue-500 h-8 w-8 rounded-full p-0"
              title="Lihat"
              onClick={onView}
            >
              <FontAwesomeIcon className="h-4 w-4 text-white" icon={faEye} />
            </Button>
          </>
        ) : (
          <>
            <Button
              className="bg-view hover:bg-blue-500 h-8 w-8 rounded-full p-0"
              title="Lihat"
              onClick={onView}
            >
              <FontAwesomeIcon className="h-4 w-4 text-white" icon={faEye} />
            </Button>
            <Button
              className="bg-edit hover:bg-yellow-500 h-8 w-8 rounded-full p-0"
              title="Ajukan"
              onClick={onApply}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPaperPlane}
              />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LetterTypeCard;
