"use client";

import Image from "next/image";
import { FC } from "react";

interface MobileNotificationModalProps {
  icon?: string;
  title: string;
  description: string;
  ios: boolean;
}

const MobileNotificationModal: FC<MobileNotificationModalProps> = ({
  icon,
  title,
  description,
  ios,
}) => {
  const MAX_DESCRIPTION_LENGTH = 80;
  let truncatedDescription = description;

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    truncatedDescription =
      description.substring(0, MAX_DESCRIPTION_LENGTH) + "...";
  }

  const appIcon = icon || "/icon.png";

  return (
    <div
      className="w-full flex items-start gap-2 p-2.5 bg-transparent rounded-[15px]"
    >
      <div
        className={`flex justify-center items-center overflow-hidden ${
          ios ? "rounded-[30%]" : "rounded-full"
        } bg-white h-[50px] w-[50px] shrink-0`}
      >
        <Image 
          src={appIcon} 
          alt="app logo" 
          width={50} 
          height={50}
          className="object-contain"
        />
      </div>
      <div className="w-[80%] flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <p className="break-all font-bold leading-5 text-[15px] text-white">
            {title}
          </p>
          <p className="text-[10px] text-white">Şimdi</p>
        </div>
        <p className="break-all leading-[15px] text-xs m-0 text-white">
          {truncatedDescription}
        </p>
      </div>
    </div>
  );
};

export default MobileNotificationModal;
