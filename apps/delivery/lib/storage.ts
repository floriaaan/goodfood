import AsyncStorage from "@react-native-async-storage/async-storage";

const setCookie = async (key: string, value: string | null) => {
  try {
    if (value === null) return await AsyncStorage.removeItem(key);
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.error(e);
  }
};

const getCookie = async (key: string, initialValue?: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value || initialValue;
  } catch (e) {
    // error reading value
    console.error(e);
  }
};

export { getCookie, setCookie };
