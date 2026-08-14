import { KnownIconType } from "@charcoal-ui/icons";
import { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconName: keyof KnownIconType;
  isProcessing: boolean;
  label?: string;
};

export const IconButton = ({
  iconName,
  isProcessing,
  label,
  className,
  ...rest
}: Props) => {
  const defaultClass =
    "bg-primary hover:bg-primary-hover active:bg-primary-press disabled:bg-primary-disabled text-white rounded-16 text-sm p-8 text-center inline-flex items-center mr-2";
  return (
    <button
      {...rest}
      className={className || defaultClass}
    >
      {isProcessing ? (
        <pixiv-icon name={"24/Dot"} scale="1" style={{ color: "#ffffff" }}></pixiv-icon>
      ) : (
        <pixiv-icon name={iconName} scale="1" style={{ color: "#ffffff" }}></pixiv-icon>
      )}
      {label && <div className="mx-4 font-bold">{label}</div>}
    </button>
  );
};
