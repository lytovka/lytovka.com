import * as Popover from "@radix-ui/react-popover";
import { GlobeIcon } from "~/components/icons";

export const LanguageSelection = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild className="z-30">
        <button className="group p-2 z-30 border rounded-full border-gray-600 dark:border-gray-300 hover:opacity-75 transition-opacity overflow-hidden">
          <GlobeIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded p-5 w-[100px] bg-white will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <div className="flex flex-col gap-2.5">
            <a href="?lng=ru">Русский</a>
            <a href="?lng=en">English</a>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
