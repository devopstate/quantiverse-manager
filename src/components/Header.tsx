import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-primary">Inventory Pro</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate("/inventory")}>
            Inventory
          </Button>
           <Button variant="ghost" onClick={() => navigate("/billing")}>
            Billing
          </Button>
          <Button variant="ghost" onClick={() => navigate("/sales")}>
            Sales
          </Button>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            Profile
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
