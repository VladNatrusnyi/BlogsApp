import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View, StyleSheet} from "react-native";
import useThemeColors from "../hooks/useThemeColors";

export const PageContainerWithKeyboard = ({children, containerStyle = {}, paddingHorizontal = 20}) => {

    const themeColors = useThemeColors();

    return (
        <SafeAreaView style={[
            styles.container,
            {backgroundColor: themeColors.primary}
        ]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={[{paddingHorizontal: paddingHorizontal}, containerStyle]}>
                        {children}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },

})
