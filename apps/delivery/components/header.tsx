import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const Header = ({
  hasBackButton = false,
}: {
  hasBackButton?: boolean;
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            hasBackButton
              ? navigation.goBack()
              : navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <MaterialIcons
            name={hasBackButton ? "arrow-back" : "menu"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={1}
          // onPress={() => console.log("user")}
        >
          <Image
            source={require("../assets/images/tmp/user.png")}
            style={styles.full}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const PADDING = 16;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: PADDING * 2 + 32,
    left: PADDING,
    width: Dimensions.get("window").width - PADDING * 2,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  full: {
    height: "100%",
    width: "100%",
  },
});
