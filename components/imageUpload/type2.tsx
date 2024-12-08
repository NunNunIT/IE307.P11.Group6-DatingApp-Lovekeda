import React, { useRef, useState } from "react";
import { View, Image, StyleSheet, Dimensions, Modal } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Plus, X } from "@/lib/icons";
import Carousel from "../carousel/type1";
import ImageUploadType1 from "./type1";

const { width, height } = Dimensions.get("window");

interface ImageUploadType1Props {
  imgs: string[];
  setImgs: (imgs: string[]) => void;
}

export default function ImageUploadType2({
  imgs = [],
  setImgs,
}: ImageUploadType1Props) {
  const [value, setValue] = React.useState("image");

  const onDelete = (indexToRemove: number) => {
    setImgs((prevImgs: any[]) =>
      prevImgs.filter((_: any, index: number) => index !== indexToRemove)
    );
  };

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className="w-full max-w-lg mx-auto flex-col gap-1.5"
    >
      <TabsList className="flex-row w-full">
        <TabsTrigger value="image" className="flex-1">
          <Text>Hình ảnh</Text>
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex-1">
          <Text>Xem trước</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="image">
        <View className="flex flex-row flex-wrap gap-2 justify-between items-center">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <View
                key={index}
                className="w-[30%] aspect-[3/4] rounded-lg overflow-hidden border-2 border-pri-color"
              >
                {!imgs[index] ? (
                  <ImageUploadType1
                    imgs={imgs}
                    setImgs={setImgs}
                    triggerContent={
                      <Button
                        size="icon"
                        variant="none"
                        className="bg-pri-color rounded-md"
                      >
                        <Plus className="size-12 text-white" />
                      </Button>
                    }
                  />
                ) : (
                  <View className="h-full w-full relative">
                    <Image
                      source={{ uri: imgs[index] }}
                      className="h-full w-full object-cover aspect-[3/4]"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full absolute top-1 right-1 size-8"
                      onPress={() => onDelete(index)}
                    >
                      <X className="size-6 text-zinc-900 dark:text-zinc-300" />
                    </Button>
                  </View>
                )}
              </View>
            ))}
        </View>
      </TabsContent>
      <TabsContent value="preview">
        {imgs.length <= 0 ? (
          <View className="w-full aspect-[3/4] flex flex-row justify-center items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <Text className="text-center">Không có ảnh để hiển thị</Text>
          </View>
        ) : (
          <Carousel data={imgs}>
            {(item) => (
              <Image
                source={{ uri: item }}
                className="w-full rounded-lg aspect-[3/4]"
                style={{ width: width }}
              />
            )}
          </Carousel>
        )}
      </TabsContent>
    </Tabs>
  );
}
