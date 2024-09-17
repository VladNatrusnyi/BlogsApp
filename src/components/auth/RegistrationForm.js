import {StyleSheet, Switch, Text, View} from "react-native";
import {AppInput} from "../UI/inputs/AppInput";
import {useState, useMemo} from 'react'
import {AppButton} from "../UI/btn/AppButton";
import useThemeColors from "../../hooks/useThemeColors";
import {BarIndicator} from "react-native-indicators";
import {ErrorSection} from "../ErrorSection";
import {auth, db} from "../../firebase/firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {push, set} from "firebase/database";
import {setRegisteredUser} from "../../store/registerSlice";
import {useDispatch} from "react-redux";
import {equalTo, get, orderByChild, query, ref} from "firebase/database";
import {useNavigation} from "@react-navigation/native";

export const RegistrationForm = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const toggleSwitch = () => setIsShowPassword(previousState => !previousState);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isAllCorrect = useMemo(() => {
        return name.trim() && email.trim() && password.trim() && (password.trim().length >= 6)
    }, [name, email, password])

    const themeColors = useThemeColors();

    const clear = () => {
        setName('')
        setEmail('')
        setPassword('')
        setIsShowPassword(false)
        setError('')
        setIsLoading(false)
    }

    const registerOperation = () => {
        setIsLoading(true);

        const usersRef = ref(db, 'users');
        const queryRef = query(usersRef, orderByChild('name'), equalTo(name));

        get(queryRef).then((snapshot) => {
            if (snapshot.exists()) {
                setIsLoading(false);
                setError('User with this name already exists.');
                console.log('User with this name already exists.');
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        const newUserRef = push(usersRef);
                        const newUserId = newUserRef.key;

                        const userData = {
                            name: name,
                            email: user.email,
                            uid: user.uid,
                            id: newUserId,
                            photo: '',
                        };

                        set(newUserRef, userData)
                            .then(async () => {
                                dispatch(setRegisteredUser(userData));
                                setIsLoading(false);
                                clear();
                                navigation.navigate('RootNavigator')
                            })
                            .catch((error) => {
                                setIsLoading(false);
                                setError(error.message);
                                console.log('Error adding new user to db:', error.message);
                            });
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        setError(error.message);
                        console.log('ERROR Registered user in auth', error.message);
                    });
            }
        }).catch((error) => {
            setIsLoading(false);
            setError(error.message);
            console.log('Database error:', error.message);
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
                    onChangeValue={(text) => setName(text)}
                    value={name}
                    placeholderText={'Nickname'}
                    iconName={'user'}
                    inputStyle={{marginBottom: 15}}
                />

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
                    text={'Register'}
                    onPress={registerOperation}
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
