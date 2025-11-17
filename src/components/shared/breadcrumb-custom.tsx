import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const BreadcrumbCustom = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5 w-fit"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};
