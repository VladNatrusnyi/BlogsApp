import {PageContainerWithKeyboard} from "../containers/PageContainerWithKeyboard";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RegistrationForm} from "../components/auth/RegistrationForm";
import useThemeColors from "../hooks/useThemeColors";
import TabComponent from "../components/TabComponent";
import {useState} from 'react'
import {LoginForm} from "../components/auth/LoginForm";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export const AuthPage = () => {
    const navigation = useNavigation();

    const themeColors = useThemeColors();

    const [activeTab, setActiveTab] = useState('Login');

    return (
        <PageContainerWithKeyboard
            containerStyle={{flex: 1, justifyContent: 'space-between'}}
        >

            <View style={styles.titleWrapper}>
                {
                    activeTab === 'Registration'
                        ? <>
                            <Text
                                style={[styles.title, {color: themeColors.secondary}]}
                            >Registration</Text>
                            <Text style={[styles.subtitle, {color: themeColors.text}]}
                            >Hello! Welcome to our app.</Text>
                        </>
                        : <>
                            <Text
                                style={[styles.title, {color: themeColors.secondary}]}
                            >Login</Text>
                            <Text style={[styles.subtitle, {color: themeColors.text}]}
                            >Glad to see you again! Enter your login details.</Text>
                        </>
                }

            </View>


            <View style={{flex: 1}}>
                <TabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
            </View>


            {
                activeTab === 'Registration'
                    ? <RegistrationForm />
                    : <LoginForm />
            }

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backWrap}
            >
                <Ionicons name="arrow-back" size={34} color={themeColors.secondary} />
                <Text style={[styles.backText, {color: themeColors.secondary}]}>Go Back</Text>
            </TouchableOpacity>


        </PageContainerWithKeyboard>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginBottom: 30
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 16,
    },
    backWrap: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginRight: 10,
        marginBottom: 10
    },
    backText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})
