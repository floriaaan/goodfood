import { MaterialCommunityIcons } from "@expo/vector-icons";
import classNames from "classnames";
import { Text, TextInput, View } from "react-native";

type InputProps = {
  label: string;
  value: string;
} & React.ComponentProps<typeof TextInput>;

export const SearchInput = ({ value, label, placeholder, ...props }: InputProps) => {
  return (
    <View className={classNames("h-14 bg-black/5 relative")}>
      <View className="absolute right-4 top-4">
        <MaterialCommunityIcons name="magnify" size={24} color="black" />
      </View>
      <Text className="absolute text-xs left-2 top-2 text-black/30">{label}</Text>
      {/* TODO: FIX text overflow  */}
      <TextInput
        multiline={false}
        numberOfLines={1}
        className={classNames(
          "text-bold w-[calc(100%-24px)] pr-10 h-full absolute  top-1 left-2 text-xl font-bold mb-0.5",
        )}
        {...{ value, onChangeText: props.onChangeText, placeholder }}
        {...props}
      />
    </View>
  );
};
