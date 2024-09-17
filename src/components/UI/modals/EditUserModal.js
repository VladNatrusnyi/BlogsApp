import React, {useState} from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import useThemeColors from "../../../hooks/useThemeColors";
import {AppInput} from "../inputs/AppInput";
import {AppButton} from "../btn/AppButton";
import {BackBtn} from "../btn/BackBtn";
import {ref, set} from "firebase/database";
import {db} from "../../../firebase/firebase";
import {convertLinkToUrl} from "../../../func/convertLinkToUrl";
import {ErrorSection} from "../../ErrorSection";
import {BarIndicator} from "react-native-indicators";
import {PageContainerWithKeyboard} from "../../../containers/PageContainerWithKeyboard";
import {FontAwesome5} from "@expo/vector-icons";
import {PersonAvatarImg} from "../avatars/PersonAvatarImg";
import * as ImagePicker from "expo-image-picker";
import {useDispatch} from "react-redux";
import {setRegisteredUser} from "../../../store/registerSlice";


export const EditUserModal = ({ visible, onClose, payload }) => {
    const dispatch = useDispatch();
    const themeColors = useThemeColors();

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [name, setName] = useState(payload ? payload.name : '')

    const [photo, setPhoto] = useState(payload ? payload.photo : null)

    const uploadPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri)
        }
    };

    const saveChanges =  async () => {
        setIsLoading(true)
        if (photo && photo !== payload.photo) {
            convertLinkToUrl(photo, payload.uid)
                .then((imageUrl) => {
                    const userRef = ref(db, `users/${payload.id}`);
                    const updatedData = {
                        ...payload,
                        name: name,
                        photo: imageUrl,
                    }
                    set(userRef, updatedData)
                        .then(() => {
                            dispatch(setRegisteredUser(updatedData))
                            console.log(`User data successfully updated`);
                            setIsLoading(false)
                            onClose()
                        })
                        .catch((error) => {
                            console.error(`Error updating user data`, error);
                           setError(error.message)
                            setIsLoading(false)
                        });

                })
                .catch((error) => {
                   setIsLoading(false)
                    setError(error.message)
                    console.error("Error getting url", error);
                });
        } else {
            const userRef = ref(db, `users/${payload.id}`);
            const updatedData = {
                ...payload,
                name: name,
            }
            set(userRef, updatedData)
                .then(() => {
                    dispatch(setRegisteredUser(updatedData))
                   setIsLoading(false)
                    console.log(`User data successfully updated`);
                    onClose()
                })
                .catch((error) => {
                    setIsLoading(false)
                    setError(error.message)
                    console.error(`Error updating user data`, error);
                });
        }
    }

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

                        <BackBtn onPress={onClose} />

                        <View style={styles.editImageWrapper}>
                            <PersonAvatarImg source={photo} />
                            <TouchableOpacity onPress={uploadPhoto} style={styles.editImageButton}>
                                <FontAwesome5 name="edit" size={28} color={themeColors.secondary} />
                            </TouchableOpacity>
                        </View>

                        <AppInput
                            // isError={!!error}
                            onChangeValue={(text) => setName(text)}
                            value={name}
                            placeholderText={'Name'}
                            iconName={'pen-tool'}
                        />

                        <AppButton
                            buttonStyle={{marginVertical: 25}}
                            text={'Save'}
                            onPress={saveChanges}
                            disabled={!name.trim()}
                        />

                        {
                            error &&
                            <ErrorSection error={error} />
                        }

                        {
                            isLoading &&
                            <BarIndicator color={themeColors.secondary} />
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

    editImageWrapper: {
        alignItems: 'center',
        position: "relative"
    },

    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        alignItems: "center",
        justifyContent: 'center',
    },
});

