import type { JSX } from "react";
import { forwardRef } from "react";

type ExtraProps = {
  title?: string;
};

const ToggleButton = forwardRef<
  ExtraProps & HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(function ToggleButton(props, ref) {
  const { title } = props;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="sr-only peer"
        ref={ref}
        type="checkbox"
        value=""
        {...props}
      />
      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.3px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
      {title ? (
        <span className="ml-4 text-2xl font-medium text-gray-900 dark:text-gray-300">
          {title}
        </span>
      ) : null}
    </label>
  );
});

export default ToggleButton;
