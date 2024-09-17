import {StyleSheet, Switch, Text, View} from "react-native";
import {AppInput} from "../UI/inputs/AppInput";
import {useState, useMemo} from 'react'
import {AppButton} from "../UI/btn/AppButton";
import useThemeColors from "../../hooks/useThemeColors";
import {BarIndicator} from "react-native-indicators";
import {ErrorSection} from "../ErrorSection";
import {auth} from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {useNavigation} from "@react-navigation/native";


export const LoginForm = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const toggleSwitch = () => setIsShowPassword(previousState => !previousState);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const themeColors = useThemeColors();

    const isAllCorrect = useMemo(() => {
        return email.trim() && password.trim() && (password.trim().length >= 6)
    }, [email, password])

    const clear = () => {
        setEmail('')
        setPassword('')
        setIsShowPassword(false)
        setError('')
        setIsLoading(false)
    }

    const loginOperation = () => {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                setIsLoading(false)
                clear()
                navigation.navigate('RootNavigator')
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
            });
    };

    return (
        <View style={styles.container}>
            <View>
                {
                    error &&
                    <ErrorSection error={error} />
                }

                <AppInput
                    isError={!!error}
                    onChangeValue={(text) => setEmail(text)}
                    value={email}
                    placeholderText={'Email'}
                    iconName={'mail'}
                    inputStyle={{marginBottom: 15}}
                />

                <AppInput
                    isPassword={isShowPassword}
                    isError={!!error}
                    onChangeValue={(text) => setPassword(text)}
                    value={password}
                    placeholderText={'Password'}
                    iconName={'lock'}
                    inputStyle={{marginBottom: 20}}
                />
                <View style={styles.showPasWrap}>
                    <Text style={[styles.showText, {color: themeColors.text}]}>Show password</Text>
                    <Switch
                        trackColor={{false: themeColors.text, true: themeColors.secondary}}
                        thumbColor={isShowPassword ? themeColors.text : themeColors.primary}
                        ios_backgroundColor={themeColors.text}
                        onValueChange={toggleSwitch}
                        value={isShowPassword}
                    />
                </View>

                <AppButton
                    buttonStyle={{marginBottom: 25}}
                    text={'Login'}
                    onPress={loginOperation}
                    disabled={!isAllCorrect}
                />

                {
                    isLoading &&
                    <BarIndicator color={themeColors.secondary} />
                }


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    showPasWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20
    },
    showText: {
        fontSize: 18,
    }
})
