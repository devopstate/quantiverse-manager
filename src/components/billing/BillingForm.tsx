import { useState, useMemo, useEffect } from "react";
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
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllProducts } from "@/services/database";

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
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products using the database service
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = useMemo(() => {
    if (!searchValue) return products;
    return products.filter(product => 
      product?.title?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [products, searchValue]);

  const handleProductSelect = (product: Product) => {
    if (!product) return;
    
    setSelectedProduct(product);
    setSellingPrice(product.sellingPrice?.toString() || '');
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

    const qtyNum = parseInt(quantity || '0');
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return false;
    }

    if (qtyNum > (selectedProduct?.quantity || 0)) {
      toast({
        title: "Error",
        description: "Quantity exceeds available stock",
        variant: "destructive",
      });
      return false;
    }

    const priceNum = parseFloat(sellingPrice || '0');
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

    const qtyNum = parseInt(quantity || '0');
    const priceNum = parseFloat(sellingPrice || '0');

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
              <CommandGroup>
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.title}
                    onSelect={() => handleProductSelect(product)}
                    disabled={product.status === "Out-of-Stock"}
                    className="flex justify-between"
                  >
                    <span>{product.title}</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      product.status === "Out-of-Stock" 
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    )}>
                      {product.status === "Out-of-Stock" 
                        ? "Out of Stock" 
                        : `${product.quantity} available`}
                    </span>
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