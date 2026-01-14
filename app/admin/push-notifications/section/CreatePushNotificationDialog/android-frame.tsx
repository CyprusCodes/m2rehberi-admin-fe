"use client";

import { FC } from "react";
import MobileNotificationModal from "./notification-mobile-modal";

interface AndroidFrameProps {
  title: string;
  message: string;
}

const AndroidFrame: FC<AndroidFrameProps> = ({ title, message }) => {
  return (
    <div className="w-[320px]">
      <div className="flex justify-center gap-[3px] mt-2.5">
        <MobileNotificationModal
          ios={false}
          title={title}
          description={message}
          icon="/icon.png"
        />
      </div>
    </div>
  );
};

export default AndroidFrame;
