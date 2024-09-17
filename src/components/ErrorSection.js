import {StyleSheet, Text, View} from "react-native";
import useThemeColors from "../hooks/useThemeColors";

export const ErrorSection = ({error}) => {

    const themeColors = useThemeColors();

    return (
        <View style={styles.titleWrapper}>
            <Text
                style={[styles.title, {color: 'red'}]}
            >Error</Text>
            <Text style={[styles.subtitle, {color: 'red'}]}
            >{error}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginVertical: 15,
        padding: 10,
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 15
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 16,
    }
});