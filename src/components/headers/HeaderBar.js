import {Platform, SafeAreaView, StyleSheet, View} from "react-native";
import {IconButton} from "../UI/btn/IconButton";
import useThemeColors from "../../hooks/useThemeColors";
import {useDispatch, useSelector} from "react-redux";
import {PersonAvatarImg} from "../UI/avatars/PersonAvatarImg";
import {useNavigationState, useRoute} from "@react-navigation/native";
import {AppInput} from "../UI/inputs/AppInput";
import {useState} from "react";
import {setSearch} from "../../store/blogsSlice";


export const HeaderBar = ({ navigation }) => {
    const themeColors = useThemeColors();
    const dispatch = useDispatch();

    const {registeredUser} = useSelector(state => state.register)
    const {search} = useSelector(state => state.blogs)

    const currentRouteName = useRoute().name;

    const [isShow, setIsShow] = useState(false);

    return (
        <>
            <View style={[styles.container, {backgroundColor: themeColors.primaryDark,}]}>
                <SafeAreaView >
                    <View style={styles.wrapper}>
                        <IconButton
                            name={'menu-fold'}
                            color={themeColors.text}
                            size={30}
                            onPress={() => {navigation.toggleDrawer()}}
                        />

                        <View style={styles.wrapper2}>
                            {
                                currentRouteName === 'AllBlogs' &&
                                <IconButton
                                    name={'search1'}
                                    color={themeColors.text}
                                    size={30}
                                    onPress={() => {setIsShow(!isShow)}}
                                />
                            }


                            {
                                registeredUser
                                    ? <PersonAvatarImg size={45}  source={registeredUser.photo} />
                                    : <IconButton
                                        name={'login'}
                                        color={themeColors.text}
                                        size={30}
                                        onPress={() => navigation.navigate('AuthPage')}
                                    />
                            }
                        </View>


                    </View>
                </SafeAreaView>
            </View>


            {
                isShow &&
                <View style={[styles.searchBlock, {backgroundColor: themeColors.primary}]}>
                    <AppInput
                        onChangeValue={(text) => dispatch(setSearch(text))}
                        value={search}
                        placeholderText={'Search'}
                        iconName={'search'}
                    />
                </View>
            }

        </>

    )
}
const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 35 : 0
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 60,
        paddingHorizontal: 20,
    },

    wrapper2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },

    searchBlock: {
        paddingHorizontal: 20,

    }
})
