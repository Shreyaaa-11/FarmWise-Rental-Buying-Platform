import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tractor, ShoppingCart, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";

interface Equipment {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available_for_sale: boolean;
  is_available_for_rent: boolean;
  rental_price_per_day: number;
}

const Index = () => {
  const { user } = useAuth();
  const { translate } = useTranslation();

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .limit(3);
        
      if (error) throw error;
      return data as Equipment[];
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {translate("Quality Farming Equipment for Sale & Rent")}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {translate("FarmGear provides high-quality agricultural equipment for farms of all sizes. Buy or rent the tools you need to maximize your productivity.")}
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Link to="/products">
                  <Button size="lg" className="gap-2">
                    <ShoppingCart className="h-4 w-4" /> {translate("Browse Products")}
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Info className="h-4 w-4" /> {translate("Learn More")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={translate("Farm equipment")}
                className="rounded-lg object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {translate("Featured Equipment")}
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl">
                {translate("Explore our top selling agricultural equipment")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">{translate("Loading featured products...")}</div>
              </div>
            ) : (
              featuredProducts?.map((product) => (
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
                      <div className="text-2xl font-bold">
                      &#8377;{product.price.toLocaleString()}
                        {product.is_available_for_rent && (
                          <span className="text-sm font-normal ml-2 text-muted-foreground">
                            {translate("or rent for")} &#8377;{product.rental_price_per_day}{translate("per day")}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Link to="/products">
              <Button size="lg">{translate("View All Products")}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials/Features Section */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {translate("Why Choose FarmGear?")}
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              {translate("Trusted by farmers across the country")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Tractor className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">{translate("Quality Equipment")}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>{translate("We offer only the best brands and most reliable equipment for your farming needs.")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">{translate("Buy or Rent")}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>{translate("Flexibility to purchase outright or rent equipment for your specific seasonal needs.")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">{translate("Expert Support")}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>{translate("Our team of agricultural experts is always available to help you choose the right equipment.")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

export default Index;
