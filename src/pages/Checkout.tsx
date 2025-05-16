import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { AddressForm } from "@/components/AddressForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { StripePaymentForm } from "@/components/StripePaymentForm";

// Initialize Stripe
const stripePromise = (() => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.error('Missing Stripe publishable key');
    return null;
  }
  return loadStripe(key);
})();

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { translate } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [addressData, setAddressData] = useState<any>(null);

  // Add error handling for missing Stripe
  if (!stripePromise) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">{translate("Payment System Error")}</h1>
            <p className="text-muted-foreground mb-6">
              {translate("Unable to initialize payment system. Please try again later.")}
            </p>
            <Button onClick={() => navigate('/cart')}>
              {translate("Return to Cart")}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleAddressSubmit = async (data: any) => {
    setAddressData(data);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsLoading(true);
    try {
      console.log('Payment successful, starting database updates...');
      console.log('User ID:', user?.id);
      console.log('Address Data:', addressData);

      if (!user?.id) {
        throw new Error('User ID is required');
      }

      // Update profile using auth.uid()
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          address: addressData.address,
          first_name: addressData.firstName,
          last_name: addressData.lastName,
          phone_number: addressData.phone,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Continue with order creation even if profile update fails
        console.log('Continuing with order creation despite profile update error');
      } else {
        console.log('Profile updated successfully:', profileData);
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: totalPrice,
            shipping_address: addressData,
            status: 'paid',
            payment_intent_id: paymentIntentId,
            is_rental: cart.some(item => item.rental),
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }
      console.log('Order created successfully:', order);

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        equipment_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        is_rental: item.rental,
        rental_start_date: item.rental_start_date,
        rental_end_date: item.rental_end_date,
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        throw itemsError;
      }
      console.log('Order items created successfully:', itemsData);

      // Clear the cart in the database
      const { error: cartError } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', user.id);

      if (cartError) {
        console.error('Cart deletion error:', cartError);
        // Don't throw here, as the order is already created
      }

      // Clear cart and show success message
      clearCart();
      toast({
        title: translate("Payment successful"),
        description: translate("Your order has been placed successfully!"),
      });
      navigate('/orders');
    } catch (error) {
      console.error('Error in handlePaymentSuccess:', error);
      toast({
        title: translate("Error"),
        description: translate("There was an error processing your order. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: translate("Payment Error"),
      description: error,
      variant: "destructive",
    });
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
      <main className="flex-grow container py-12">
        <h1 className="text-3xl font-bold mb-6">{translate("Checkout")}</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Address Form or Payment Form */}
          <div className="md:col-span-2">
            <div className="rounded-lg border p-6">
              {!showPaymentForm ? (
                <>
                  <h2 className="text-lg font-semibold mb-4">{translate("Shipping Information")}</h2>
                  <AddressForm onSubmit={handleAddressSubmit} isLoading={isLoading} />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">{translate("Payment Information")}</h2>
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      amount={totalPrice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isLoading={isLoading}
                    />
                  </Elements>
                </>
              )}
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
                          {item.rental ? (
                            <>
                              {translate("Rental")} × {item.quantity}
                              {item.rental_start_date && item.rental_end_date && (
                                <span className="ml-2">
                                  ({format(new Date(item.rental_start_date), "MMM dd")} - {format(new Date(item.rental_end_date), "MMM dd, yyyy")})
                                </span>
                              )}
                            </>
                          ) : (
                            `${translate("Purchase")} × ${item.quantity}`
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {item.rental && item.rental_days ? (
                        <>
                          &#8377;{(item.price * item.rental_days * item.quantity).toLocaleString()}
                          <span className="text-sm font-normal ml-2 text-muted-foreground">
                            (&#8377;{item.price.toLocaleString()}/{translate("day")} × {item.rental_days} {translate("days")})
                          </span>
                        </>
                      ) : (
                        <>&#8377;{(item.price * item.quantity).toLocaleString()}</>
                      )}
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
