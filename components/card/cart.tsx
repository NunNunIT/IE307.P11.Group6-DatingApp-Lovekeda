import React, { useEffect, useState, useCallback, memo } from "react";
import { View, Image, TouchableOpacity, TextInput } from "react-native";
import { Text } from "~/components/ui/text";
import { supabase } from "@/supabase/supabase";
import { useAuth } from "@/provider/AuthProvider";
import { router } from "expo-router";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CartCardProps {
  id: any;
  productId: any;
  removeItem?: (productId: number) => void;
  quantity: number;
  onUpdateTotal: () => void;
}

const CartCard: React.FC<CartCardProps> = memo(
  ({ id, productId, removeItem, quantity, onUpdateTotal }) => {
    const [productData, setProductData] = useState<{
      id?: number;
      image?: string;
      title?: string;
      price?: number;
      quantity?: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [inputQuantity, setInputQuantity] = useState(quantity.toString());
    const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(
      null
    );

    const { session } = useAuth();
    const userId = session?.user?.id;

    const fetchProductDetails = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${productId}`
        );
        const data = await response.json();
        setProductData({
          ...data,
          quantity: quantity,
        });
      } catch (error) {
        console.error(
          `Error fetching product details for ID ${productId}:`,
          error
        );
      } finally {
        setIsLoading(false);
      }
    }, [productId, quantity]);

    useEffect(() => {
      fetchProductDetails();
    }, [fetchProductDetails]);

    // Update quantity with debounce
    const updateQuantity = useCallback(
      async (newQuantity: number) => {
        if (!productData?.id || !userId) return;

        // Clear any existing timeout
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        // Set a new timeout
        const timeout = setTimeout(async () => {
          try {
            const { error } = await supabase
              .from("cart")
              .update({
                quantity: newQuantity,
                price: productData.price,
              })
              .eq("product_id", productData.id)
              .eq("user_id", userId);

            if (error) throw error;

            setProductData((prev) =>
              prev ? { ...prev, quantity: newQuantity } : prev
            );
            onUpdateTotal();
          } catch (err) {
            console.error("Error updating quantity:", err);
            // Revert to previous quantity on error
            setInputQuantity(quantity.toString());
          }
        }, 500); // 500ms delay

        setUpdateTimeout(timeout);
      },
      [productData?.id, productData?.price, userId, quantity, onUpdateTotal]
    );

    const handleQuantityChange = useCallback(
      (text: string) => {
        const newQuantity = parseInt(text) || 1;
        if (newQuantity > 0) {
          setInputQuantity(text);
          updateQuantity(newQuantity);
        }
      },
      [updateQuantity]
    );

    if (isLoading) {
      return (
        <View className="w-full flex flex-row gap-3 items-center p-2 mb-3">
          <Skeleton className="h-36 w-36 rounded-md" />
          <View className="h-36 flex flex-col justify-start items-start gap-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </View>
        </View>
      );
    }

    const itemTotal =
      (productData?.price || 0) * (parseInt(inputQuantity) || 0);

    return (
      <View className="w-full relative flex flex-row items-center justify-between rounded-lg bg-white shadow dark:bg-zinc-900 p-2 mb-3">
        <View className="w-3/4">
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/productDetail/${productData?.id}?name=${productData?.title}`
              )
            }
            className="flex flex-row items-start justify-between gap-3"
          >
            <Image
              source={{
                uri:
                  productData?.image ||
                  "https://www.gasso.com/wp-content/uploads/2017/04/noimage.jpg",
              }}
              className="aspect-square w-36 object-contain bg-white"
              resizeMode="contain"
            />
            <View className="w-full px-3 flex flex-col items-start justify-between">
              <Text className="line-clamp-2 pt-2 text-left text-xl font-semibold">
                {productData?.title || "Tên sản phẩm"}
              </Text>
              <Text className="font-semibold text-red-500 text-left text-xl">
                ${productData?.price?.toFixed(2) || "0.00"}
              </Text>
              <Text className="font-semibold text-red-500 text-left text-xl">
                Total ${itemTotal.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="w-1/4 flex flex-col items-end justify-between gap-2 px-3 pb-2">
          <AlertWithButtons id={id} removeItem={removeItem} />
          <View className="flex flex-row items-center gap-2">
            <Button
              onPress={() => {
                const newQuantity = Math.max(1, parseInt(inputQuantity) - 1);
                setInputQuantity(newQuantity.toString());
                updateQuantity(newQuantity);
              }}
              variant="secondary"
              className="rounded-md"
            >
              <Text>-</Text>
            </Button>

            <TextInput
              className="rounded-md border-2 border-zinc-200 dark:border-zinc-800 py-3 w-12 text-center"
              value={inputQuantity}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
            />

            <Button
              onPress={() => {
                const newQuantity = parseInt(inputQuantity) + 1;
                setInputQuantity(newQuantity.toString());
                updateQuantity(newQuantity);
              }}
              className="rounded-md"
              variant="secondary"
            >
              <Text>+</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
);

const AlertWithButtons = ({ id, removeItem }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Text className="text-white">X</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onPress={() => removeItem(id)}>
              <Text>OK</Text>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartCard;
