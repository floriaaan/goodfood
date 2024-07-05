import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const StepIndicator = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[styles.circle, currentStep >= index + 1 ? styles.activeCircle : styles.inactiveCircle]}>
            <Text style={[styles.stepText, currentStep >= index + 1 ? styles.activeText : styles.inactiveText]}>
              {index + 1}
            </Text>
          </View>
          <Text style={styles.label}>{step}</Text>
        </View>
      ))}
      <View style={styles.lineContainer}>
        {new Array(steps.length - 1).fill(0).map((_, index) => (
          <View key={index} style={[styles.line, currentStep > index + 1 ? styles.activeLine : styles.inactiveLine]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepContainer: {
    zIndex: 2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  lineContainer: {
    position: "absolute",
    height: 2,
    top: 12,
    left: 36,
    right: 36,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  activeCircle: {
    borderColor: "#008D5E",
    backgroundColor: "#008D5E",
  },
  inactiveCircle: {
    borderColor: "grey",
    backgroundColor: "white",
  },
  stepText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  activeText: {
    color: "white",
  },
  inactiveText: {
    color: "grey",
  },
  label: {
    marginTop: 4,
    width: 54,
    textAlign: "center",
    color: "grey",
    fontSize: 12,
  },
  line: {
    height: 2,
    flex: 1,
  },
  activeLine: {
    backgroundColor: "#008D5E",
  },
  inactiveLine: {
    backgroundColor: "grey",
  },
});
