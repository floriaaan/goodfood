import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useNative } from "@/hooks/useNative";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Switch } from "react-native-gesture-handler";

export default function Settings() {
  const { logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const { updateFrequency, setUpdateFrequency } = useNative();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* <View style={styles.header}>
          <View style={styles.headerAction}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <MaterialCommunityIcons
                color="#000"
                name="arrow-left"
                size={24}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
            >
              <MaterialCommunityIcons color="#000" name="more" size={24} />
            </TouchableOpacity>
          </View>
        </View> */}
        <View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Préférences</Text>
            <View style={styles.sectionBody}>
              <View style={styles.rowWrapper}>
                <View
                  style={[
                    styles.row,
                    {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      height: "auto",
                      paddingVertical: 12,
                    },
                  ]}
                >
                  <Text style={styles.rowLabel}>
                    Fréquence de rafraîchissement de la localisation
                  </Text>
                  <Text style={styles.rowValue}>
                    Diminuer la fréquence de mise à jour entraînera une baisse
                    de commandes à livrer
                  </Text>
                </View>
                <Picker
                  selectedValue={updateFrequency}
                  onValueChange={(f) => setUpdateFrequency(f)}
                >
                  <Picker.Item label="30 secondes" value={1000 * 30} />
                  <Picker.Item label="1 minute" value={1 * 1000 * 60} />
                  <Picker.Item label="5 minutes" value={5 * 1000 * 60} />
                  <Picker.Item label="10 minutes" value={10 * 1000 * 60} />
                </Picker>
              </View>
              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Notifications push</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={(p) => setPushNotifications(p)}
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={pushNotifications}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ressources</Text>
            <View style={styles.sectionBody}>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Signaler un problème</Text>
                  <View style={styles.rowSpacer} />
                  <MaterialCommunityIcons
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Nous noter sur le store</Text>
                  <View style={styles.rowSpacer} />
                  <MaterialCommunityIcons
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.rowWrapper, styles.rowLast]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Conditions d'utilisation</Text>
                  <View style={styles.rowSpacer} />
                  <MaterialCommunityIcons
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View
                style={[
                  styles.rowWrapper,
                  styles.rowFirst,
                  styles.rowLast,
                  { alignItems: "center" },
                ]}
              >
                <TouchableOpacity onPress={logout} style={styles.row}>
                  <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                    Se déconnecter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.contentFooter}>app version 1.0-beta1</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  content: {
    marginTop: 16 * 8,
    paddingBottom: 32,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: "100%",
    paddingHorizontal: 16,
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
  },
  /** Content */
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    color: "#a69f9f",
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: "500",
    color: "#a69f9f",
    textTransform: "uppercase",
  },
  sectionBody: {},
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
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: "auto",
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
  /** Row */
  row: {
    height: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  rowFirst: {},
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: "#000",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#ababab",
    marginRight: 4,
  },
  rowLast: {},
  rowLabelLogout: {
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    color: "#dc2626",
  },
});
