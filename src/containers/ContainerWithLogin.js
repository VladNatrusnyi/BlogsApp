import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useThemeColors from "../hooks/useThemeColors";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const ContainerWithLogin = ({ children, paddingHorizontal = 20 }) => {
    const themeColors = useThemeColors();
    const { registeredUser } = useSelector(state => state.register);
    const navigation = useNavigation();

    return (
      <View style={[styles.container, { paddingHorizontal: paddingHorizontal, backgroundColor: themeColors.primary }]}>
          {registeredUser
            ? <View style={styles.loggedInContent}>{children}</View>
            : <View style={styles.loggedOutContent}>
                <Text style={[styles.loggedOutText, { color: themeColors.text }]}>You must be a logged in user to continue</Text>
                <View style={styles.logoutBlock}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AuthPage')}
                      style={styles.logoutBtn}
                    >
                        <Feather name="log-in" size={24} color={themeColors.secondary} />
                        <Text style={[styles.logoutBtnText, { color: themeColors.secondary }]}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
          }
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        flex: 1,
    },
    loggedInContent: {
        flex: 1,
    },
    loggedOutContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    loggedOutText: {
        fontSize: 18,
    },
    logoutBlock: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    logoutBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
    },
    logoutBtnText: {
        fontSize: 18,
    },
});
