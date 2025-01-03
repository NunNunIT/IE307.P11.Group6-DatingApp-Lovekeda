import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { supabase } from "@/supabase/supabase";
import CartCard from "@/components/card/cart";
import { useAuth } from "@/provider/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";
import { ShoppingCart } from "@/lib/icons";

const CartScreen = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Fetch cart items with product details in a single query
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
          id,
          product_id,
          quantity,
          price
        `
        )
        .eq("user_id", userId);

      if (error) throw error;

      if (data) {
        setCartItems(data);
        const total = data.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
        setTotalAmount(total);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems])
  );

  // Initial fetch
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCartItems();
    setRefreshing(false);
  }, [fetchCartItems]);

  const removeItem = useCallback(
    async (productId: number) => {
      try {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("id", productId);
        if (error) throw error;
        await fetchCartItems();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    },
    [fetchCartItems]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <CartCard
        key={item.id}
        id={item.id}
        productId={item.product_id}
        quantity={item.quantity}
        removeItem={removeItem}
        onUpdateTotal={fetchCartItems}
      />
    ),
    [removeItem, fetchCartItems]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View className="flex-1 justify-center items-center mt-20">
              <Image
                source={require("~/assets/images/noCart.png")}
                className="size-64 mb-2"
                resizeMode="contain"
              />
              <Text className="text-center text-xl text-zinc-600 dark:text-zinc-400">
                Your cart is empty
              </Text>
            </View>
          )
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Total Amount: ${totalAmount.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              cartItems.length === 0 && styles.disabledButton,
            ]}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
  },
  checkoutButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CartScreen;
