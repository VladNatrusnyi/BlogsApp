import {KeyboardAvoidingView, Platform, View, StyleSheet} from "react-native";
import useThemeColors from "../hooks/useThemeColors";

export const KeyboardWrap = ({children, containerStyle = {}, paddingHorizontal = 20}) => {

    const themeColors = useThemeColors();

    return (
        <View style={[
            styles.container,
            {backgroundColor: themeColors.primary}
        ]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <View style={{flex: 1}}>
                    <View style={[{paddingHorizontal: paddingHorizontal}, containerStyle]}>
                        {children}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    scrollContainer: {
        flexGrow: 1,
    },
})
