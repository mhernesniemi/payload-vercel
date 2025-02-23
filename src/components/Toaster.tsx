"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast:
            "bg-gray-100 border border-gray-500 text-gray-900 [&:not([data-type])]:bg-gray-100",
          error: "!bg-red-50 !border-red-500 !text-red-900",
          success: "!bg-green-50 !border-green-500 !text-green-900",
          warning: "!bg-yellow-50 !border-yellow-500 !text-yellow-900",
          info: "!bg-blue-50 !border-blue-500 !text-blue-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
