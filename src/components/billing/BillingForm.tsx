import { useState, useEffect } from "react";
import { Product } from "@/types/inventory";
import { BillItem } from "@/types/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillingFormProps {
  onAddToBill: (item: BillItem) => void;
}

export const BillingForm = ({ onAddToBill }: BillingFormProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Get products from localStorage
  const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSellingPrice(product.sellingPrice.toString());
    setQuantity("");
    setOpen(false);
  };

  const validateInputs = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return false;
    }

    const qtyNum = parseInt(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return false;
    }

    if (qtyNum > selectedProduct.quantity) {
      toast({
        title: "Error",
        description: "Quantity exceeds available stock",
        variant: "destructive",
      });
      return false;
    }

    const priceNum = parseFloat(sellingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAddToBill = () => {
    if (!validateInputs() || !selectedProduct) return;

    const qtyNum = parseInt(quantity);
    const priceNum = parseFloat(sellingPrice);

    onAddToBill({
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      purchasePrice: selectedProduct.purchasePrice,
      sellingPrice: priceNum,
      quantity: qtyNum,
      total: qtyNum * priceNum,
    });

    // Reset form
    setSelectedProduct(null);
    setQuantity("");
    setSellingPrice("");
    setSearchValue("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {selectedProduct ? selectedProduct.title : "Select product..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Search products..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.title}
                    onSelect={() => handleProductSelect(product)}
                    disabled={product.status === "Out-of-Stock"}
                    className={cn(
                      "flex items-center justify-between",
                      product.status === "Out-of-Stock" && "opacity-50"
                    )}
                  >
                    <span>{product.title}</span>
                    {selectedProduct?.id === product.id && (
                      <Check className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedProduct && (
          <span className="text-sm text-muted-foreground">
            Available: {selectedProduct.quantity} units
          </span>
        )}
      </div>

      <Input
        type="text"
        placeholder="Selling Price (₹)"
        value={sellingPrice}
        onChange={(e) => {
          if (!/^\d*\.?\d*$/.test(e.target.value)) return;
          setSellingPrice(e.target.value);
        }}
      />

      <Input
        type="text"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => {
          if (!/^\d*$/.test(e.target.value)) return;
          setQuantity(e.target.value);
        }}
      />

      <Button onClick={handleAddToBill}>
        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Bill
      </Button>
    </div>
  );
};