import React from "react";
import { View, Image, TouchableOpacity, Alert } from "react-native";

import { Text } from "~/components/ui/text";
import { Button } from "../ui/button";
import { Plus, Star } from "~/lib/icons";
import { router } from "expo-router";
import { supabase } from "@/supabase/supabase"; // Cấu hình Supabase
import { useAuth } from "~/provider/AuthProvider"; // Import hook useAuth để lấy thông tin user

interface ProductCardProps {
  data?: {
    id?: number; // Thêm ID sản phẩm vào interface
    image?: string;
    title?: string;
    price?: number;
    rating?: {
      rate?: number;
      count?: number;
    };
  };
  noText?: boolean;
  width?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  data,
  noText = false,
  width,
}) => {
  const { session } = useAuth(); // Lấy thông tin user từ session

  const addCart = async () => {
    try {
      if (!session || !session.user.id) {
        Alert.alert("Thông báo", "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
      }

      const userId = session.user.id;

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
      const { data: existingCartItem, error: fetchError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", data?.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116: Không tìm thấy dòng nào
        console.error("Error fetching cart item:", fetchError.message);
        return;
      }

      if (existingCartItem) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng
        Alert.alert("Đã có trong giỏ hàng", "Sản phẩm này đã có trong giỏ hàng.");
        return;
      }

      // Nếu chưa có sản phẩm, thêm sản phẩm mới
      const { error: insertError } = await supabase.from("cart").insert([
        {
          user_id: userId,
          product_id: data?.id,
          quantity: 1,
          price: data?.price,
        },
      ]);

      if (insertError) {
        console.error("Error adding to cart:", insertError.message);
        Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng.");
        return;
      }

      Alert.alert("Thêm giỏ hàng thành công", "Sản phẩm đã được thêm vào giỏ hàng.");
    } catch (error) {
      console.error("Error in addCart:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  return (
    <View
      className={`${
        width ? width : "w-full"
      } relative overflow-hidden flex flex-col items-center justify-between rounded-lg bg-white shadow dark:bg-zinc-900`}
    >
      <TouchableOpacity
        onPress={() =>
          router.push(`/productDetail/${data?.id}?name=${data?.title}`)
        }
        className="flex flex-col items-center justify-between"
      >
        <Image
          source={{
            uri:
              data?.image ||
              "https://www.gasso.com/wp-content/uploads/2017/04/noimage.jpg",
          }}
          className="aspect-square w-full object-contain bg-white"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text className="line-clamp-2 w-full px-3 pt-2 text-left text-xl">
        {data?.title || "Tên sản phẩm"}
      </Text>

      <View className="flex w-full flex-row items-center justify-between gap-2 px-3 pb-2">
        <View className="flex flex-col gap-1">
          <Text className="font-semibold text-red-500">
            ${data?.price?.toFixed(2) || "10.00"}
          </Text>
          <View className="flex flex-row items-center gap-1">
            <Text className="text-[#f59e0b]">
              {data?.rating?.rate?.toFixed(1) || "0.00"}
            </Text>
            <Star fill={"#f59e0b"} className="size-2 text-[#f59e0b]" />
            <Text className="text-zinc-600 dark:text-zinc-300">
              ({data?.rating?.count})
            </Text>
          </View>
        </View>
        <Button
          onPress={addCart}
          variant="secondary"
          size="icon"
          className="rounded-full"
        >
          <Plus className="size-6 text-zinc-600" />
        </Button>
      </View>
    </View>
  );
};
