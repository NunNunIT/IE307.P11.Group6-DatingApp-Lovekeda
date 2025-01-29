import _ from "lodash";
import React, { Component, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import {
  Colors,
  Incubator,
  Picker,
  PickerProps,
  RenderCustomModalProps,
  PickerMethods,
  PickerItemProps,
  Icon,
} from "react-native-ui-lib";
import { Check, ChevronDown, ChevronsUpDown, X } from "@/lib/icons";
import { useColorScheme } from "nativewind";
import { Text } from "../ui/text";
import {
  PickerMultiValue,
  PickerSingleValue,
  PickerValue,
} from "react-native-ui-lib/src/components/picker/types";
import { Button } from "../ui/button";

var { width, height } = Dimensions.get("window");

const dropdownIcon = (
  <ChevronsUpDown className="size-12 text-black dark:text-white" />
);

type props = {
  options: PickerItemProps[];
  value: string;
  onChange: (value: PickerSingleValue) => void;
  title?: string;
  placeholder?: string;
  selectionLimit?: number;
  positionDialog?: "left" | "right" | "top" | "bottom";
  directionDialog?: "up" | "down" | "left" | "right";
  showSearch?: boolean;
  dialogCustom?: boolean;
  widthDialog?: number;
  heightDialog?: number;
  useDialogDefault?: boolean;
};

export default function SingleChoicePicker({
  value,
  onChange,
  options,
  title,
  placeholder,
  selectionLimit,
  directionDialog = "down",
  positionDialog = "bottom",
  showSearch = false,
  dialogCustom = false,
  useDialogDefault = false,
  widthDialog = 1,
  heightDialog = 0.5,
}: props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const renderDialog: PickerProps["renderOverlay"] = (
    modalProps: RenderCustomModalProps
  ) => {
    const { visible, children, toggleModal, onDone } = modalProps;
    return (
      <Incubator.Dialog
        visible={visible}
        onDismiss={() => {
          onDone();
          toggleModal();
        }}
        width={width * widthDialog}
        height={height * heightDialog}
        {...{ [positionDialog]: true }}
        useSafeArea
        containerStyle={{
          backgroundColor: colorScheme !== "dark" ? Colors.white : Colors.black,
        }}
        direction={directionDialog}
        headerProps={{ title: title }}
      >
        <ScrollView className="flex-1 h-full">{children}</ScrollView>
      </Incubator.Dialog>
    );
  };

  const handleChange = (items: PickerMultiValue | PickerSingleValue) => {
    onChange(items as string);
  };

  return (
    <Picker
      value={value}
      onChange={handleChange}
      mode={Picker.modes.SINGLE}
      trailingAccessory={dropdownIcon}
      {...(dialogCustom ? { renderOverlay: renderDialog } : {})}
      items={options}
      enableModalBlur={false}
      {...(useDialogDefault ? { useDialog: true } : {})}
      selectionLimit={selectionLimit || undefined}
      {...(showSearch ? { showSearch: true } : {})}
      searchPlaceholder={"Tìm kiếm"}
      searchStyle={{
        color: Colors.blue30,
        placeholderTextColor: Colors.grey50,
      }}
      renderItem={(
        value: PickerValue,
        itemProps: PickerItemProps & {
          isSelected: boolean;
          isItemDisabled: boolean;
        },
        label?: string
      ) => {
        const { isSelected, isItemDisabled } = itemProps;

        return (
          <View
            className={`px-4 py-2 w-fit flex flex-row items-center justify-between mb-1 border-b-2 border-zinc-100 } ${
              isItemDisabled && "opacity-30"
            }`}
          >
            <Text
              className={`text-left text-lg ${
                isSelected ? "text-pri-color" : "text-black"
              }`}
            >
              {label}
            </Text>
            {isSelected && <Check className={`size-8 text-pri-color`} />}
          </View>
        );
      }}
      // renderInput={(_value?: any, label?: string) => {
      //   return (
      //     <View className="w-full flex flex-row justify-between items-center py-4">
      //       <View className="w-2/5">
      //         <Text className="text-wrap">{title}</Text>
      //       </View>
      //       <View className="w-2/5 flex flex-row justify-end items-center">
      //         <Text className="line-clamp-1">{label}</Text>
      //         <ChevronDown className="size-8 text-black dark:text-white" />
      //       </View>
      //     </View>
      //   );
      // }}

      renderInput={(_value?: any, label?: string) => {
        return (
          <View className="w-full flex flex-row justify-between items-center">
            <Text className="line-clamp-1">{label}</Text>
            <ChevronDown className="size-8 text-black dark:text-white" />
          </View>
        );
      }}
    />
    // </Picker>
  );
}
