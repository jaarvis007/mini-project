import { View, Text, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Icon, ListItem } from "react-native-elements";
import colorValue from "../constants/ColorValue";
import { commonJustify, commonStyle } from "../constants/commonStyle";
import fontValue from "../constants/FontValue";
import { color } from "react-native-elements/dist/helpers";
import { AntDesign } from "@expo/vector-icons";
import { getData, getMyObject } from "../global/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import { ActivityIndicator } from "react-native-paper";

const SearchProfile = (profileData) => {
  const userDetail = profileData.route.params.item;
  // console.log(userDetail);
  const [targetUser, setTargetUser] = useState("");
  const [currUser, setCurrUser] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    // do stuff here...
    AsyncStorage.getItem("user").then((data) => {
      setCurrUser(JSON.parse(data));
    });
  }, []);

  const handleReg = (e) => {
    // console.log(e);
    setTargetUser(e);
    generateReq();
  };

  const generateReq = async (e) => {
    // e.preventDefault();

    try {
      if (!currUser || !targetUser) {
        console.log(currUser)
        console.log(targetUser)

        Alert.alert("User Not Found");
        return;
      }

      console.log(currUser, targetUser);
      Axios.post(`${process.env.EXPO_PUBLIC_CLIENT_URL}/api/v1/func/sendReq`, {
        currUser,
        targetUser,
      })
        .then((response) => {
          if (response.data.success) {
            console.log(response);
            Alert.alert("Requested Successfull");
          }
        })
        .catch((err) => {
          Alert.alert("Error", err.message);
          console.log(err);
        });
    } catch (err) {
      Alert.alert("Error", err.message);
      console.log(err);
    }
  };

  const openDialer = () => {
    Linking.openURL(`tel:${userDetail.phone}`);
  };


  return (
    <ScrollView>

      {userDetail === null ? (<ActivityIndicator />) : (
        <View>
          <View style={[commonJustify.rowCenter, { marginVertical: 20 }]}>
            <Avatar
              size={100}
              rounded
              icon={{ name: "user", type: "font-awesome" }}
              containerStyle={{ backgroundColor: colorValue.primary }}
            />
          </View>

          <View>
            <Text
              style={[
                commonStyle({ fontSize: 25, color: colorValue.liteDark3 }).text,
                commonJustify.textCenter,
              ]}
            >
              {userDetail.name}
            </Text>
          </View>
          <View style={[commonJustify.rowCenter, { marginVertical: 10 }]}>
            <Icon name="map" />
            <Text
              style={[
                commonStyle({ fontSize: 15, color: colorValue.liteDark3 }).text,
                commonJustify.textCenter,
              ]}
            >
              {userDetail.location}
            </Text>
          </View>

          <View style={[commonJustify.rowSpaceEvenly, { marginVertical: 20 }]}>
            <Button
              onPress={() => openDialer()}
              buttonStyle={{ backgroundColor: colorValue.info }}
              title="Call Now"
            />
            <Button
              onPress={() => handleReg(userDetail)}
              buttonStyle={{ backgroundColor: colorValue.primary }}
              title="Request"
            />
          </View>

          <View style={commonJustify.rowSpaceEvenly}>
            <View style={style.card}>
              <Text
                style={[
                  commonStyle({ fontSize: 24, fontFamily: fontValue.PoninsBold })
                    .text,
                  { textAlign: "center" },
                ]}
              >
                {userDetail.bloodtype}
              </Text>
              <Text
                style={[
                  commonStyle({
                    fontSize: 14,
                    fontFamily: fontValue.PoppinsRegular,
                  }).text,
                  { textAlign: "center" },
                ]}
              >
                BloodType
              </Text>
            </View>
            <View style={style.card}>
              <Text
                style={[
                  commonStyle({ fontSize: 24, fontFamily: fontValue.PoninsBold })
                    .text,
                  { textAlign: "center" },
                ]}
              >
                {userDetail.donationCnt}
              </Text>
              <Text
                style={[
                  commonStyle({
                    fontSize: 14,
                    fontFamily: fontValue.PoppinsRegular,
                  }).text,
                  { textAlign: "center" },
                ]}
              >
                Donated
              </Text>
            </View>
            <View style={style.card}>
              <Text
                style={[
                  commonStyle({ fontSize: 24, fontFamily: fontValue.PoninsBold })
                    .text,
                  { textAlign: "center" },
                ]}
              >
                {userDetail.requestCnt}
              </Text>
              <Text
                style={[
                  commonStyle({
                    fontSize: 14,
                    fontFamily: fontValue.PoppinsRegular,
                  }).text,
                  { textAlign: "center" },
                ]}
              >
                Requested
              </Text>
            </View>
          </View>

          <View style={{ marginVertical: 15 }}>
            <ListItem
              containerStyle={[{ marginTop: 10 }, { marginHorizontal: 10 }]}
              bottomDivider
            >
              <Icon color={colorValue.primary} name="phone" />
              <ListItem.Content>
                <ListItem.Title>Contact: {userDetail.phone}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={[{ marginTop: 10 }, { marginHorizontal: 10 }]}
              bottomDivider
            >
              <Icon color={colorValue.primary} name="mail" />
              <ListItem.Content>
                <ListItem.Title>E-mail : {userDetail.email}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

          </View>
        </View >
      )}

    </ScrollView>
  );
};

export default SearchProfile;

const style = StyleSheet.create({
  card: {
    backgroundColor: colorValue.white,
    padding: 10,
  },
});
