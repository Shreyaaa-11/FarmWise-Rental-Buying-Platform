import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface Category {
  id: string;
  name: string;
}

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

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { translate } = useTranslation();
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
        
      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('equipment')
        .select('*');
      
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }
        
      const { data, error } = await query;
      if (error) throw error;
      return data as Equipment[];
    }
  });

  // Filter products based on search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Sidebar with filters */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">{translate("Search")}</h3>
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="search"
                  placeholder={translate("Search products...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="icon" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{translate("Categories")}</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  {translate("All Categories")}
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {translate(category.name)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{translate("Products")}</h1>
              <div className="text-sm text-muted-foreground">
                {filteredProducts ? filteredProducts.length : 0} {translate("products found")}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">{translate("Loading products...")}</div>
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id}>
                    <Card className="h-full overflow-hidden transition-all hover:border-primary">
                      <div className="aspect-[16/10] w-full overflow-hidden">
                        <img
                          src={product.image_url || "https://placehold.co/400x300?text=No+Image"}
                          alt={product.name}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-bold">
                          ${product.price.toLocaleString()}
                        </div>
                        {product.is_available_for_rent && product.rental_price_per_day && (
                          <div className="text-sm text-muted-foreground">
                            {translate("Rent")}: ${product.rental_price_per_day}{translate("per day")}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock_quantity > 0 ? translate("In Stock") : translate("Out of Stock")}
                        </div>
                        <Button size="sm">{translate("View Details")}</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted">
                <p>{translate("No products found matching your criteria.")}</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  {translate("Clear Filters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} FarmGear. {translate("All rights reserved.")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:underline">{translate("Home")}</Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:underline">{translate("Products")}</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:underline">{translate("About")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products;
