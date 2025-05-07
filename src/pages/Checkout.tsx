import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { AddressForm } from "@/components/AddressForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { loadRazorpayScript } from "@/lib/razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { translate } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript()
      .then(() => setIsRazorpayLoaded(true))
      .catch((error) => {
        console.error('Error loading Razorpay:', error);
        toast({
          title: translate("Error"),
          description: translate("Failed to load payment system. Please try again later."),
          variant: "destructive",
        });
      });
  }, [toast, translate]);

  const handleAddressSubmit = async (addressData: any) => {
    if (!isRazorpayLoaded) {
      toast({
        title: translate("Error"),
        description: translate("Payment system is not ready. Please try again in a moment."),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user?.id,
            items: cart,
            total_amount: totalPrice,
            shipping_address: addressData,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // amount in paise
        currency: "INR",
        name: "FarmWise",
        description: "Payment for your order",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Update order with payment details
            const { error: updateError } = await supabase
              .from('orders')
              .update({
                payment_id: response.razorpay_payment_id,
                status: 'paid',
              })
              .eq('id', order.id);

            if (updateError) throw updateError;

            // Clear cart and show success message
            clearCart();
            toast({
              title: translate("Payment successful"),
              description: translate("Your order has been placed successfully!"),
            });
            navigate('/orders');
          } catch (error) {
            console.error('Error updating order:', error);
            toast({
              title: translate("Error"),
              description: translate("There was an error processing your payment. Please contact support."),
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: addressData.fullName,
          email: user?.email,
          contact: addressData.phoneNumber,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: translate("Error"),
        description: translate("There was an error processing your order. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">{translate("Your Cart is Empty")}</h1>
            <p className="text-muted-foreground mb-6">
              {translate("Please add items to your cart before proceeding to checkout.")}
            </p>
            <Button onClick={() => navigate('/products')}>
              {translate("Browse Products")}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">{translate("Checkout")}</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Address Form */}
          <div className="md:col-span-2">
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">{translate("Shipping Information")}</h2>
              <AddressForm onSubmit={handleAddressSubmit} isLoading={isLoading} />
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="rounded-lg border p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">{translate("Order Summary")}</h2>
              
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "https://placehold.co/100x100?text=No+Image"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.rental ? translate("Rental") : translate("Purchase")} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      &#8377;{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{translate("Subtotal")}</span>
                  <span>&#8377;{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{translate("Tax")}</span>
                  <span>&#8377;{(totalPrice * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{translate("Shipping")}</span>
                  <span>{translate("Free")}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{translate("Total")}</span>
                  <span>&#8377;{(totalPrice * 1.18).toLocaleString()}</span>
                </div>
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

export default Checkout;
