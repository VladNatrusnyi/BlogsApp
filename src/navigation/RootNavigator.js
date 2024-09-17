import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {MyAndSubPage} from "../pages/MyAndSubPage";
import {Feather} from "@expo/vector-icons";
import {Image, StyleSheet, Text, Touchable, TouchableOpacity, View} from "react-native";
import {HeaderBar} from "../components/headers/HeaderBar";
import useThemeColors from "../hooks/useThemeColors";
import {useDispatch, useSelector} from "react-redux";
import {PersonAvatarImg} from "../components/UI/avatars/PersonAvatarImg";
import {auth} from "../firebase/firebase";
import {signOut} from "firebase/auth";
import {USER_LOGOUT_FROM_APP} from "../store";
import {AllBlogsNavigator} from "./AllBlogsNavigator";
import {CreateBlogPage} from "../pages/CreateBlogPage";
import {SettingsPage} from "../pages/SettingsPage";

const Drawer = createDrawerNavigator();


const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const {registeredUser} = useSelector(state => state.register)
    const themeColors = useThemeColors();

    const logoutFunc = () => {
        signOut(auth).then( async () => {
            props.navigation.toggleDrawer()
            dispatch({type: USER_LOGOUT_FROM_APP})
        }).catch((error) => {
            console.log('Error logout: ', error)
        });
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={{justifyContent: 'space-between'}}>

                {
                    registeredUser
                        ? <View style={styles.userWrapper}>
                            <PersonAvatarImg size={100} iconSize={90} source={registeredUser.photo}/>
                            <Text style={[styles.userName, {color: themeColors.text}]}>{registeredUser.name}</Text>
                        </View>
                        : <Image
                            source={require('../../assets/img/transparentLogo.png')}
                            style={{width: 150, height: 150, alignSelf: 'center', marginBottom: 10}}
                            resizeMode={'contain'}
                        />
                }
                <DrawerItemList  {...props} />

                {
                    registeredUser &&
                    <View style={styles.logoutBlock}>
                        <TouchableOpacity
                            onPress={logoutFunc}
                            style={styles.logoutBtn}
                        >
                            <Feather name="log-out" size={24} color={themeColors.secondary} />
                            <Text style={{fontSize: 18, color: themeColors.secondary}}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                }


            </View>
        </DrawerContentScrollView>
    );
}

export const RootNavigator = () => {

    const themeColors = useThemeColors();

    return (
        <Drawer.Navigator
            initialRouteName={'AllBlogs'}
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                sceneContainerStyle: {backgroundColor: 'transparent'},
                headerTransparent: false,
                drawerActiveTintColor: themeColors.secondary,
                drawerInactiveTintColor: themeColors.text,
                // drawerActiveBackgroundColor: '#c31919',
                drawerStyle: {
                    backgroundColor: themeColors.primaryDark,
                    borderRightWidth: 2,
                    borderColor: themeColors.secondary
                },
            }}
        >
            <Drawer.Screen
                name="AllBlogs"
                component={AllBlogsNavigator}
                options={({navigation}) => ({
                    header: () => <HeaderBar navigation={navigation}/>,
                    title: 'All blogs',
                    drawerIcon: ({color}) => (
                        <View style={{width: 30}}>
                            <Feather name="list" size={24} color={color}/>
                        </View>
                    ),
                })}
            />

            <Drawer.Screen
                name="CreateNewBlog"
                component={CreateBlogPage}
                options={({navigation}) => ({
                    header: () => <HeaderBar navigation={navigation}/>,
                    title: 'Create blog',
                    drawerIcon: ({color}) => (
                        <View style={{width: 30}}>
                            <Feather name="plus" size={24} color={color}/>
                        </View>
                    ),
                })}
            />

            <Drawer.Screen
                name="My Blogs"
                component={MyAndSubPage}
                options={({navigation}) => ({
                    header: () => <HeaderBar navigation={navigation}/>,
                    title: 'My blogs',
                    drawerIcon: ({color}) => (
                        <View style={{width: 30}}>
                            <Feather name="clipboard" size={24} color={color}/>
                        </View>
                    ),
                })}
            />

            <Drawer.Screen
                name="My Subscriptions"
                component={MyAndSubPage}
                options={({navigation}) => ({
                    header: () => <HeaderBar navigation={navigation}/>,
                    title: 'My subscriptions',
                    drawerIcon: ({color}) => (
                        <View style={{width: 30}}>
                            <Feather name="eye" size={24} color={color}/>
                        </View>
                    ),
                })}
            />

            <Drawer.Screen
                name="Settings"
                component={SettingsPage}
                options={({navigation}) => ({
                    header: () => <HeaderBar navigation={navigation}/>,
                    title: 'Settings',
                    drawerIcon: ({color}) => (
                        <View style={{width: 30}}>
                            <Feather name="settings" size={24} color={color}/>
                        </View>
                    ),
                })}
            />

        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    userWrapper: {
        alignItems: 'center',
        gap: 10,
        marginBottom: 15
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutBlock :{height: 100, width: '100%', justifyContent: 'flex-end', alignItems: 'center'},
    logoutBtn: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5},
})
