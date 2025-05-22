import { Colors } from "@/constants/Colors";
import { AnimalType } from "@/types";
import { Image } from "expo-image";
import React from "react";
import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";
export default function AnimalChoice({
  animalType,
  setAnimalType,
}: {
  animalType?: AnimalType;
  setAnimalType: (animalType: AnimalType) => void;
}) {
  return (
    <Animated.View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        marginBottom: 20,
      }}
    >
      <Text style={{}}>Animal Type</Text>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        horizontal
        data={[AnimalType.DOG, AnimalType.CAT]}
        
        renderItem={({ item }) => (
          <AnimalChoiceItem  animalType={item} setAnimalType={setAnimalType} />
        )}
      />
    </Animated.View>
  );
}
const AnimalChoiceItem = ({
  animalType,
  setAnimalType,
}: {
  animalType: AnimalType;
  setAnimalType: (animalType: AnimalType) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => setAnimalType(animalType)}
      style={{
        borderLeftWidth: 1,
        borderRightWidth: 3,
        borderTopWidth: 1,
        borderBottomWidth: 3,
        borderColor: Colors.light.text,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <View style={{}}>
        <Image
          contentFit="contain"
          source={
            animalType === "dog"
              ? require("@/assets/images/dog.png")
              : require("@/assets/images/cat.png")
          }
          style={{ width: 30, height: 30 }}
        />
        <Text style={{}}>{animalType === "dog" ? "Dog" : "Cat"}</Text>
      </View>
    </TouchableOpacity>
  );
};
