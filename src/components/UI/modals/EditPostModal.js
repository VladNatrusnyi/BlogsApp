import React, {useState} from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import useThemeColors from "../../../hooks/useThemeColors";
import {AppInput} from "../inputs/AppInput";
import {AppButton} from "../btn/AppButton";
import {BackBtn} from "../btn/BackBtn";
import {ref, set} from "firebase/database";
import {db} from "../../../firebase/firebase";
import {ErrorSection} from "../../ErrorSection";
import {BarIndicator} from "react-native-indicators";
import {PageContainerWithKeyboard} from "../../../containers/PageContainerWithKeyboard";


export const EditPostModal = ({ visible, onClose, payload }) => {

    const themeColors = useThemeColors();

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [postText, setPostText] = useState(JSON.parse(payload.content))

    const editPost = async () => {
        setIsLoading(true)

        const blogRef = ref(db, `posts/${payload.id}`);

        set(blogRef, {
            ...payload,
            content: JSON.stringify(postText)

        })
            .then(() => {
                setIsLoading(false)
                setError('')
                onClose()
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
            });
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

                        <AppInput
                            // isError={!!error}
                            onChangeValue={(text) => setPostText(text)}
                            value={postText}
                            placeholderText={'type...'}
                            iconName={'pen-tool'}
                            // inputStyle={{marginBottom: isFocused ? 10 : 30, width: '85%'}}
                            multiline={true}
                        />

                        <AppButton
                            buttonStyle={{marginVertical: 25}}
                            text={'Save'}
                            onPress={editPost}
                            disabled={!postText.trim()}
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
    }
});

