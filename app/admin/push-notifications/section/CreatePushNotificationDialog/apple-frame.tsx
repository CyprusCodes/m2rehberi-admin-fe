"use client";

import { FC } from "react";
import MobileNotificationModal from "./notification-mobile-modal";

interface AppleFrameProps {
  title: string;
  message: string;
}

const AppleFrame: FC<AppleFrameProps> = ({ title, message }) => {
  return (
    <div className="h-[70%] flex items-end">
      <div
        className="overflow-hidden w-[320px] rounded-[10px] flex"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <div className="h-full flex flex-col justify-between opacity-75">
          <MobileNotificationModal
            ios={true}
            title={title}
            description={message}
            icon="/icon.png"
          />
        </div>
      </div>
    </div>
  );
};

export default AppleFrame;
