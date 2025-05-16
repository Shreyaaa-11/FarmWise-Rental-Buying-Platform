import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const Orders = () => {
  const { user } = useAuth();
  const { translate } = useTranslation();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            equipment (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <h1 className="text-3xl font-bold mb-8">{translate("Your Orders")}</h1>
        
        {isLoading ? (
          <div className="text-center">{translate("Loading...")}</div>
        ) : orders?.length === 0 ? (
          <div className="text-center text-muted-foreground">
            {translate("No orders found")}
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order) => (
              <div key={order.id} className="rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {translate("Order ID")}: {order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate("Date")}: {format(new Date(order.created_at), "PPP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {translate("Total")}: ₹{order.total_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate("Status")}: {order.status}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.equipment?.image_url || "https://placehold.co/100x100?text=No+Image"}
                          alt={item.equipment?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{item.equipment?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.is_rental ? (
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
                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders; 