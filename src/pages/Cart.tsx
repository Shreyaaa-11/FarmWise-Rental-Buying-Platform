import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { format } from "date-fns";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const { translate } = useTranslation();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">{translate("Your Cart is Empty")}</h1>
            <p className="text-muted-foreground mb-6">
              {translate("Looks like you haven't added any items to your cart yet.")}
            </p>
            <Link to="/products">
              <Button size="lg">{translate("Browse Products")}</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">{translate("Shopping Cart")}</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="rounded-lg border divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "https://placehold.co/100x100?text=No+Image"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.rental ? translate("Rental") : translate("Purchase")}
                      {item.rental && item.rental_start_date && item.rental_end_date && (
                        <span className="ml-2">
                          ({format(new Date(item.rental_start_date), "MMM dd")} - {format(new Date(item.rental_end_date), "MMM dd, yyyy")})
                        </span>
                      )}
                    </p>
                    <p className="font-medium">
                      &#8377;{item.price.toLocaleString()}{item.rental ? `/${translate("day")}` : ''}
                      {item.rental && item.rental_days && (
                        <span className="text-sm font-normal ml-2 text-muted-foreground">
                          × {item.rental_days} {translate("days")} = &#8377;{(item.price * item.rental_days).toLocaleString()}
                        </span>
                      )}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1), item.rental)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              updateQuantity(item.product_id, value, item.rental);
                            }
                          }}
                          className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.rental)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.product_id, item.rental)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{translate("Remove")}</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right font-medium">
                  &#8377;{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="rounded-lg border p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">{translate("Order Summary")}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{translate("Subtotal")}</span>
                  <span>&#8377;{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{translate("Tax")}</span>
                  <span>{translate("Calculated at checkout")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{translate("Shipping")}</span>
                  <span>{translate("Calculated at checkout")}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{translate("Total")}</span>
                  <span>&#8377;{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                {translate("Proceed to Checkout")}
              </Button>
              
              <div className="mt-4 text-center">
                <Link to="/products" className="text-sm text-primary hover:underline">
                  {translate("Continue Shopping")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {translate("FarmWise. All rights reserved.")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
