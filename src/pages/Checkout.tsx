import React from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/TranslationContext";

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const { translate } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">{translate("Checkout")}</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">{translate("Order Summary")}</h2>
              
              {cart.length === 0 ? (
                <p>{translate("Your cart is empty")}</p>
              ) : (
                <div className="space-y-4">
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
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{translate("Total Amount")}</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form - Placeholder */}
          <div>
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">{translate("Payment Details")}</h2>
              <p className="mb-4 text-muted-foreground">{translate("Please enter your payment information to complete your purchase.")}</p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium">{translate("Name on Card")}</label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={translate("John Doe")}
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="card" className="block mb-1 text-sm font-medium">{translate("Card Number")}</label>
                  <input
                    id="card"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="**** **** **** ****"
                    disabled
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block mb-1 text-sm font-medium">{translate("Expiry Date")}</label>
                    <input
                      id="expiry"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder={translate("MM/YY")}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block mb-1 text-sm font-medium">{translate("CVC")}</label>
                    <input
                      id="cvc"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="123"
                      disabled
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  className="w-full py-2 px-4 bg-primary text-white rounded-md mt-4 opacity-50 cursor-not-allowed"
                  disabled
                >
                  {translate("Pay Now (Coming Soon)")}
                </button>
              </form>
              
              <p className="mt-4 text-sm text-muted-foreground text-center">
                {translate("Stripe integration will be added soon.")}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-background">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {translate("FarmGear. All rights reserved.")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
