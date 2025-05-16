import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/TranslationContext";
import { RentalDatePicker } from "@/components/RentalDatePicker";
import { useAuth } from "@/contexts/AuthContext";

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
  const [rentalDates, setRentalDates] = useState<{ start: Date; end: Date } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!product) return;
    
    if (purchaseType === 'rent' && !rentalDates) {
      toast({
        title: translate("Error"),
        description: translate("Please select rental dates"),
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      product_id: product.id,
      name: product.name,
      price: purchaseType === 'buy' ? product.price : (product.rental_price_per_day || 0),
      image: product.image_url || '',
      quantity: 1,
      rental: purchaseType === 'rent',
      rental_days: purchaseType === 'rent' ? Math.ceil((rentalDates!.end.getTime() - rentalDates!.start.getTime()) / (1000 * 60 * 60 * 24)) : undefined,
      rental_start_date: purchaseType === 'rent' ? rentalDates!.start.toISOString() : undefined,
      rental_end_date: purchaseType === 'rent' ? rentalDates!.end.toISOString() : undefined,
    });
    
    toast({
      title: translate("Successfully added to cart"),
      description: translate("Added to cart: ") + product.name,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">{translate("Loading product details...")}</div>
          </div>
        ) : product ? (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={product.image_url || "https://placehold.co/600x600?text=No+Image"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-xl font-medium mt-2">
                  &#8377;{product.price.toLocaleString()}
                  {product.is_available_for_rent && product.rental_price_per_day && (
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      {translate("or rent for")} &#8377;{product.rental_price_per_day}{translate("per day")}
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
              
              <div>
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
                        <div className="text-2xl font-bold">&#8377;{product.price.toLocaleString()}</div>
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
                      <div className="space-y-4">
                        <RentalDatePicker 
                          onDateSelect={(start, end) => setRentalDates({ start, end })}
                          className="mb-4"
                        />
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">
                            &#8377;{product.rental_price_per_day}{translate("per day")}
                            {rentalDates && (
                              <span className="text-sm font-normal ml-2 text-muted-foreground">
                                {translate("Total for")} {Math.ceil((rentalDates.end.getTime() - rentalDates.start.getTime()) / (1000 * 60 * 60 * 24))} {translate("days")}: &#8377;{(product.rental_price_per_day || 0) * Math.ceil((rentalDates.end.getTime() - rentalDates.start.getTime()) / (1000 * 60 * 60 * 24))}
                              </span>
                            )}
                          </div>
                          <Button 
                            onClick={() => handleAddToCart('rent')}
                            disabled={product.stock_quantity < 1 || !product.is_available_for_rent || !rentalDates}
                          >
                            {translate("Add to Cart")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">{translate("Product not found")}</div>
          </div>
        )}
      </main>
      
      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} FarmWise. {translate("All rights reserved.")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
