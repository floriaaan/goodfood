import { Motion } from "@legendapp/motion";
import { TextInput, View } from "react-native";

type InputProps = {
  value: string;

  placeholder: string;
} & React.ComponentProps<typeof TextInput>;

export const Input = ({ value, placeholder, ...props }: InputProps) => {
  return (
    <View
      style={{
        height: 72,
        borderWidth: 2,
        width: "100%",
        marginBottom: 2,
        marginLeft: 2,
        borderColor: value.length > 0 ? "black" : "rgba(0, 0, 0, 0.25)",
      }}
    >
      {placeholder && (
        <Motion.Text
          style={{
            position: "absolute",
            color: value.length > 0 ? "black" : "rgba(0, 0, 0, 0.25)",
            marginTop: value.length > 0 ? 0 : 1.5,
          }}
          animate={
            value.length > 0
              ? { top: 10, left: 10, fontSize: 12 }
              : { top: 24, left: 24, fontSize: 16 }
          }
          transition={{ duration: 100, type: "tween" }}
        >
          {placeholder}
        </Motion.Text>
      )}
      <TextInput
        style={{
          color: "black",
          width: "100%",
          height: "100%",
          paddingHorizontal: 16,
          fontSize: 16,
          fontWeight: "700",
          position: "absolute",
          top: 0,
          left: 6,
          marginBottom: 2,
        }}
        {...{ value, onChangeText: props.onChangeText }}
        {...props}
      />
    </View>
  );
};
