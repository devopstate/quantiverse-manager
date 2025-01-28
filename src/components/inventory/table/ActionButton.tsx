import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface ActionButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

export const ActionButton = ({ isEditing, onEdit, onSave }: ActionButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isEditing ? onSave : onEdit}
    >
      {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
    </Button>
  );
};