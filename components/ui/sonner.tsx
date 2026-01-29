import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        style: {
          background: "#ffffff",
          border: "2px solid #005ca4",
          color: "#12385f",
          fontSize: "14px",
          fontWeight: "500",
          padding: "16px",
          borderRadius: "8px",
        },
        classNames: {
          toast: "!bg-white !text-[#12385f] !border-2 !border-[#005ca4]",
          description: "!text-[#5b5b5f]",
          actionButton: "!bg-[#005ca4] !text-white hover:!bg-[#004b90]",
          cancelButton: "!bg-[#f4f7fb] !text-[#005ca4]",
          success: "!bg-white !text-[#12385f] !border-[#005ca4]",
          error: "!bg-white !text-[#12385f] !border-[#c56266]",
          warning: "!bg-white !text-[#12385f] !border-[#f57c00]",
          info: "!bg-white !text-[#12385f] !border-[#005ca4]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

