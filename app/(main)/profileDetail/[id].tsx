// import * as React from "react";
// import { Dimensions, Text, View } from "react-native";
// import Carousel from "react-native-reanimated-carousel";

// function Index() {
//   const width = Dimensions.get("window").width;
//   return (
//     <View style={{ flex: 1 }}>
//       <Carousel
//         // loop
//         width={width}
//         height={width / 2}
//         // autoPlay={true}
//         data={[...new Array(6).keys()]}
//         scrollAnimationDuration={1000}
//         onSnapToItem={(index) => console.log("current index:", index)}
//         pagingEnabled
//         renderItem={({ index }) => (
//           <View
//             style={{
//               flex: 1,
//               borderWidth: 1,
//               justifyContent: "center",
//             }}
//             className="bg-pri-color"
//           >
//             <Text style={{ textAlign: "center", fontSize: 30 }}>{index}</Text>
//           </View>
//         )}
//       />
//       <View className="flex flex-row gap-2">
//       [...new Array(6).keys()].map(index) => {
//         <Pressable onPress={setRenderItem} className={`flex-1 h-3 rounded-full bg-white/50 ${index == renderItem ? "bg-white": "bg-white/50"}`}>
//         </Pressable>
//       }
//       </View>
//     </View>
//   );
// }

// export default Index;

import React from "react";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex flex-1 flex-col justify-center gap-4 p-4">
      <Text>Noti</Text>
    </View>
  );
}
