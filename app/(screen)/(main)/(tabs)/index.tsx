import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { ProductCard } from "~/components/card/product";
import { Text } from "~/components/ui/text";
import { Carousel } from "react-native-ui-lib";

const { width, height } = Dimensions.get("screen");

const decorate = [
  { img: require("~/assets/images/decorate/1.png") },
  { img: require("~/assets/images/decorate/2.png") },
  { img: require("~/assets/images/decorate/3.png") },
  { img: require("~/assets/images/decorate/4.png") },
  { img: require("~/assets/images/decorate/5.png") },
  { img: require("~/assets/images/decorate/6.png") },
];

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProduct = (item) => (
    <View style={styles.productContainer}>
      <ProductCard title={item.title} price={item.price} image={item.image} />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Carousel
        autoplay
        autoplayInterval={5000}
        loop
        initialPage={2}
        pageWidth={width}
        className="h-96"
        allowAccessibleLayout
      >
        {decorate.map((item, index) => (
          <Image
            key={index}
            source={item.img}
            style={{ height: "100%", width: "100%", resizeMode: "cover" }}
          />
        ))}
      </Carousel>

      <Text className="text-red-500 text-3xl font-bold py-2 px-2">
        Hot Deals🔥 ⏱️
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View className="flex flex-row justify-between flex-wrap gap-8 px-2">
          {products.slice(0, 6).map((product, index) => (
            <ProductCard key={index} data={product} width={"w-[47%] min-[999px]:w-[20%]"} />
          ))}
        </View>
      )}

      <Image
        source={require("~/assets/images/decorate/8.png")}
        className="w-full h-96 object-contain mt-8"
      />

      <Text className="text-red-500 text-3xl font-bold py-2 px-2 mt-8">
        New Arrivals ⏱️
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View className="flex flex-row flex-wrap gap-8 px-2 justify-between">
          {products.slice(6, 12).map((product, index) => (
            <ProductCard key={index} data={product} width={"w-[47%] min-[999px]:w-[20%]"} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
});
