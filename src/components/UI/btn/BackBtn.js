import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import useThemeColors from "../../../hooks/useThemeColors";

export const BackBtn = ({ onPress }) => {

  const themeColors = useThemeColors();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}>
      <Feather name="arrow-left" size={24} color={themeColors.secondary} />
      <Text style={[styles.text, { color: themeColors.secondary }]}>Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  text: {
    fontSize: 18
  }
});
