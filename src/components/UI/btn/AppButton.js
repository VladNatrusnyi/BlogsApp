import {StyleSheet, Text, TouchableOpacity} from "react-native";
import useThemeColors from "../../../hooks/useThemeColors";

export const AppButton = ({
                                 onPress,
                                 text,
                                 disabled = false,
                                 buttonStyle,
                                 color = null
                             }) => {

    const themeColors = useThemeColors();

    return (
        <TouchableOpacity
            disabled={disabled}
            style={{
                ...styles.button,
                ...buttonStyle,
                backgroundColor: disabled ? 'gray' : !color ? themeColors.secondary: color,
                borderWidth: 2,
                borderColor: disabled ? themeColors.primary : themeColors.secondary
            }}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, {color: themeColors.text}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 18
    }
})
