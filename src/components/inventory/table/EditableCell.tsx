import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/inventory";

interface EditableCellProps {
  isEditing: boolean;
  type: "text" | "number" | "category";
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
}

export const EditableCell = ({
  isEditing,
  type,
  value,
  onChange,
  className = "",
}: EditableCellProps) => {
  if (!isEditing) {
    return <span className={`${type === "category" ? "capitalize" : ""} ${className}`}>{value}</span>;
  }

  if (type === "category") {
    return (
      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electronics">Electronics</SelectItem>
          <SelectItem value="clothing">Clothing</SelectItem>
          <SelectItem value="food">Food</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
};