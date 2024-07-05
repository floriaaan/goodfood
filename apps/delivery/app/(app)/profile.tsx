import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Users = () => {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image
            alt=""
            source={require("@/assets/images/tmp/user.png")}
            style={styles.profileAvatar}
          />
          <View>
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileHandle}>{user?.email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 66,
    paddingHorizontal: 8,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "400",
    color: "#858585",
  },
});
