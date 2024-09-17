import {PageContainer} from "../containers/PageContainer";
import {StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import useThemeColors from "../hooks/useThemeColors";
import {useDispatch, useSelector} from "react-redux";
import {setTheme} from "../store/themeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Feather} from "@expo/vector-icons";
import {EditUserModal} from "../components/UI/modals/EditUserModal";
import {DeleteUserModal} from "./BlogNavigator/DeleteUserModal";


export const SettingsPage = () => {
    const themeColors = useThemeColors();
    const dispatch = useDispatch();

    const { theme } = useSelector(state => state.theme);
    const {registeredUser} = useSelector(state => state.register)

    const toggleTheme = async () => {
        try {
            const currentTheme = await AsyncStorage.getItem('theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            await AsyncStorage.setItem('theme', newTheme);
            console.log('Theme changed:', newTheme);
        } catch (error) {
            console.error('Error theme changing', error);
        }
    };

    const [isShowPassword, setIsShowPassword] = useState(theme === 'dark' ? false : true );
    const toggleSwitch = () => {
        if(isShowPassword){
            dispatch(setTheme('dark'))
            toggleTheme('dark')
            setIsShowPassword(false)
        } else {
            dispatch(setTheme('light'))
            toggleTheme('light')
            setIsShowPassword(true)
        }

    };


    const [modalEditVisible, setModalEditVisible] = useState(false);

    const openEditModal = () => setModalEditVisible(true);
    const closeEditModal = () => setModalEditVisible(false);

    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

    const openDeleteModal = () => setModalDeleteVisible(true);
    const closeDeleteModal = () => setModalDeleteVisible(false);

    return (
        <PageContainer>
            <View style={styles.showPasWrap}>
                <Text style={[styles.showText, {color: themeColors.text}]}>Theme {theme}</Text>
                <Switch
                    trackColor={{false: themeColors.text, true: themeColors.secondary}}
                    thumbColor={isShowPassword ? themeColors.text : themeColors.primary}
                    ios_backgroundColor={themeColors.text}
                    onValueChange={toggleSwitch}
                    value={isShowPassword}
                />
            </View>

            <TouchableOpacity
                onPress={openEditModal}
                style={[styles.button, {backgroundColor: themeColors.primaryDark}]}>
                <Text style={[styles.text, {color: themeColors.text}]}>Edit profile</Text>
                <Feather name="arrow-right" size={28} color={themeColors.text} />
            </TouchableOpacity>


            <TouchableOpacity
                onPress={openDeleteModal}
                style={[styles.button, {backgroundColor: themeColors.primaryDark}]}>
                <Text style={[styles.text, {color: themeColors.text}]}>Delete profile</Text>
                <Feather name="arrow-right" size={28} color={themeColors.text} />
            </TouchableOpacity>

            <EditUserModal visible={modalEditVisible} onClose={closeEditModal} payload={registeredUser} />

            <DeleteUserModal visible={modalDeleteVisible} onClose={closeDeleteModal}  />
        </PageContainer>
    )
}

const styles = StyleSheet.create({
    showPasWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20
    },
    showText: {
        fontSize: 18,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})
