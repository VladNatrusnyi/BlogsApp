import useThemeColors from "../../hooks/useThemeColors";
import {useState} from "react";
import {Modal, StyleSheet, Switch, Text, View} from "react-native";
import {PageContainerWithKeyboard} from "../../containers/PageContainerWithKeyboard";
import {BackBtn} from "../../components/UI/btn/BackBtn";
import {AppInput} from "../../components/UI/inputs/AppInput";
import {AppButton} from "../../components/UI/btn/AppButton";
import {ErrorSection} from "../../components/ErrorSection";
import {BarIndicator} from "react-native-indicators";
import {useDispatch, useSelector} from "react-redux";
import {auth, db} from "../../firebase/firebase";
import {deleteUser, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {equalTo, get, orderByChild, query, ref, remove} from "firebase/database";
import {getStorage, ref as storeRef, deleteObject} from "firebase/storage";
import {USER_LOGOUT_FROM_APP} from "../../store";


export const DeleteUserModal = ({visible, onClose}) => {
    const dispatch = useDispatch()
    const themeColors = useThemeColors();
    const {registeredUser} = useSelector(state => state.register)

    const [isShowPassword, setIsShowPassword] = useState(false);
    const toggleSwitch = () => setIsShowPassword(previousState => !previousState);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [password, setPassword] = useState('')

    const deleteAccountFunc = async () => {
        setIsLoading(true)
        try {
            const user = auth.currentUser;

            const credential = EmailAuthProvider.credential(user.email, password);

            await reauthenticateWithCredential(user, credential);

            await deleteUser(user);

            const userRef = ref(db, `users/${registeredUser.id}`);
            await remove(userRef);


            if (registeredUser.photo) {
                const storage = getStorage();
                const desertRef = storeRef(storage, registeredUser.uid);
                await deleteObject(desertRef);
            }

            const coursesRef = ref(db, 'blogs');
            const coursesToDeleteRef = query(coursesRef, orderByChild('creatorId'), equalTo(registeredUser.uid));

            const snapshot = await get(coursesToDeleteRef);

            if (snapshot.val()) {
                for (const [childSnapshotKey, childSnapshot] of Object.entries(snapshot.val())) {
                    if (childSnapshot.photo) {
                        const storage = getStorage();
                        const desertRef = storeRef(storage, childSnapshotKey);
                        await deleteObject(desertRef);
                    }
                    await remove(ref(db, `blogs/${childSnapshotKey}`));

                    const postsRef = ref(db, 'posts');
                    const postsToDeleteRef = query(postsRef, orderByChild('blogId'), equalTo(childSnapshotKey));

                    const snapshot2 = await get(postsToDeleteRef);
                    if (snapshot2.val()) {
                        for (const [childSnapshotKey, childSnapshot] of Object.entries(snapshot2.val())) {
                            await remove(ref(db, `posts/${childSnapshotKey}`));
                        }
                    }

                }
            }

            setIsLoading(false);

            dispatch({type: USER_LOGOUT_FROM_APP})

            onClose()

        } catch (error) {
            setError(`Error deleting account: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <PageContainerWithKeyboard
                paddingHorizontal={0}
                containerStyle={{flex: 1}}
            >
                <View style={styles.backdrop}>
                    <View style={[styles.modalContent, {backgroundColor: themeColors.primary,}]}>

                        <BackBtn onPress={onClose}/>

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
                            buttonStyle={{marginVertical: 25}}
                            text={'Delete'}
                            onPress={deleteAccountFunc}
                            disabled={(!password.trim() && password.length < 6)}
                        />

                        {
                            error &&
                            <ErrorSection error={error}/>
                        }

                        {
                            isLoading &&
                            <BarIndicator color={themeColors.secondary}/>
                        }

                    </View>
                </View>
            </PageContainerWithKeyboard>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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
});



