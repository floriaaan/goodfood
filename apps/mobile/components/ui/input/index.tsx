import classNames from "classnames";
import { TextInput, View } from "react-native";
import { Motion } from "@legendapp/motion";

type InputProps = {
  value: string;

  placeholder: string;
} & React.ComponentProps<typeof TextInput>;

export const Input = ({ value, placeholder, ...props }: InputProps) => {
  return (
    <View
      className={classNames(
        "h-[72px] border-2",
        // wtf issue with view width and flex gap
        "w-[calc(100%-8px)] mb-2 ml-2 ",
        value.length > 0 ? "border-black" : "border-black/25"
      )}
    >
      {placeholder && (
        <Motion.Text
          className={classNames(
            "absolute",
            value.length > 0 ? "text-black " : "text-black/25 mt-0.5"
          )}
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
        className={classNames(
          "text-bold w-full h-full absolute -top-2.5 left-0 px-4 text-xl font-bold mb-0.5"
        )}
        {...{ value, onChangeText: props.onChangeText }}
        {...props}
      />
    </View>
  );
};
