import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseApp } from "../firebaseConfig";

const HomeScreen = () => {
  const db = getFirestore(firebaseApp);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "dummy"));
    let newItems = [];
    querySnapshot.forEach((doc) => {
      let item = { ...doc.data(), id: doc.id };
      newItems.push(item);
    });
    setItems(newItems);
    console.log(items);
  };

  const addData = async () => {
    if (text == "") {
      return;
    }
    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, "dummy"), {
        text: text,
        isDone: false,
      });
      setIsLoading(false);
      getData();
    } catch (e) {
      setIsLoading(false);
    }
    setText("");
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <View className="flex-1 bg-white">
      <View className="mt-[50] mx-[24]">
        <Text className="font-bold">Add a New Data</Text>
        <View className="mt-2">
          <TextInput
            value={text}
            className="p-2 border border-gray-200 rounded-md"
            placeholder="Type here..."
            onChangeText={(e) => setText(e)}
          />
        </View>
        <TouchableOpacity
          className="mt-2 bg-black p-3 rounded-md"
          onPress={() => {
            addData();
          }}
          disabled={isLoading}
        >
          <Text className="text-white text-center">Submit</Text>
        </TouchableOpacity>
        <View className="mt-4">
          <ScrollView>
            {items?.map((item) => (
              <View key={item.id} className="bg-slate-50 p-3 my-2 rounded-sm">
                <Text>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
