import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/TranslationContext";

interface Equipment {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price_per_day: number | null;
  stock_quantity: number;
  is_available_for_sale: boolean;
  is_available_for_rent: boolean;
  image_url: string | null;
  category_id: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { translate } = useTranslation();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Equipment;
    },
    enabled: !!id
  });

  const handleAddToCart = (purchaseType: 'buy' | 'rent') => {
    if (!product) return;
    
    addToCart({
      product_id: product.id,
      name: product.name,
      price: purchaseType === 'buy' ? product.price : (product.rental_price_per_day || 0),
      image: product.image_url || '',
      quantity: 1,
      rental: purchaseType === 'rent',
      rental_days: purchaseType === 'rent' ? 1 : undefined,
    });
    
    toast({
      title: translate("Successfully added to cart"),
      description: translate("Added to cart: ") + product.name,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container py-8 flex items-center justify-center">
          <div className="text-center">{translate("Loading product details...")}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{translate("Product Not Found")}</h2>
            <p className="mt-2">{translate("The product you are looking for does not exist.")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden border">
            <img
              src={product.image_url || "https://placehold.co/800x600?text=No+Image"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-xl font-medium mt-2">
                ${product.price.toLocaleString()}
                {product.is_available_for_rent && product.rental_price_per_day && (
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    {translate("or rent for")} ${product.rental_price_per_day}{translate("per day")}
                  </span>
                )}
              </p>
            </div>
            
            <div className={`inline-flex px-3 py-1 rounded-full text-sm ${product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock_quantity > 0 ? 
                `${translate("In Stock")} (${product.stock_quantity} ${translate("available")})` : 
                translate("Out of Stock")}
            </div>
            
            <div className="py-4 border-t border-b">
              <h3 className="text-lg font-medium mb-2">{translate("Description")}</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{translate("Purchase Options")}</h3>
              
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" disabled={!product.is_available_for_sale}>{translate("Buy")}</TabsTrigger>
                  <TabsTrigger value="rent" disabled={!product.is_available_for_rent}>{translate("Rent")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="buy">
                  <div className="p-4 rounded-lg border bg-card text-card-foreground">
                    <p className="mb-4">{translate("Own this equipment for your farm permanently.")}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">${product.price.toLocaleString()}</div>
                      <Button 
                        onClick={() => handleAddToCart('buy')}
                        disabled={product.stock_quantity < 1 || !product.is_available_for_sale}
                      >
                        {translate("Add to Cart")}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="rent">
                  <div className="p-4 rounded-lg border bg-card text-card-foreground">
                    <p className="mb-4">{translate("Rent this equipment for your seasonal needs.")}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">${product.rental_price_per_day}{translate("per day")}</div>
                      <Button 
                        onClick={() => handleAddToCart('rent')}
                        disabled={product.stock_quantity < 1 || !product.is_available_for_rent}
                      >
                        {translate("Add to Cart")}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} FarmGear. {translate("All rights reserved.")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
