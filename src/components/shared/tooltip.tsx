import {
  TooltipContent,
  Tooltip as TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  style?: React.CSSProperties;
};

export const Tooltip = ({ content, trigger, style }: Props) => {
  return (
    <TooltipProvider>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent style={style} className="text-base max-w-sm">
        {content}
      </TooltipContent>
    </TooltipProvider>
  );
};
