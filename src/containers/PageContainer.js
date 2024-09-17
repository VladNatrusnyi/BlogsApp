import { Platform, SafeAreaView, View, StyleSheet } from "react-native";
import useThemeColors from "../hooks/useThemeColors";

export const PageContainer = ({ children, containerStyle = {} }) => {
    const themeColors = useThemeColors();

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.primary }]}>
          <View style={[styles.innerContainer, containerStyle]}>
              {children}
          </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    innerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
    },
});
