import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { ProductCard } from "~/components/card/product";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("screen");

export default function CategoriesScreen() {
  const { category, name } = useLocalSearchParams(); // Lấy tham số từ route
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!category) {
      console.error("Category is missing in route params");
      setLoading(false);
      return;
    }

    try {
      const apiUrl =
        category !== "all"
          ? `https://fakestoreapi.com/products/category/${name}` 
          : `https://fakestoreapi.com/products`; 

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Fetched products:", data);

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]); // Fetch lại khi `category` thay đổi

  const renderProduct = ({ item }) => (
    <ProductCard data={item} width={"w-[47%]"} />
  );

  return (
    <View className="flex-1 h-full">
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderProduct}
          numColumns={2} // Hiển thị dạng lưới với 2 cột
          columnWrapperStyle={styles.row} // Cách dòng trong grid
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products available.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
