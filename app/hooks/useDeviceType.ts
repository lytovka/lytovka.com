import { useEffect, useState } from "react";
import { isMobile } from "~/utils/user-agent";

type DeviceType = "desktop" | "mobile" | null;

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>(null);

  useEffect(() => {
    if (isMobile()) setDeviceType("mobile");
    else setDeviceType("desktop");
  }, []);

  return deviceType;
};
