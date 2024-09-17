import {createStackNavigator} from "@react-navigation/stack";
import {AllBlogsPage} from "../pages/AllBlogsNavigator/AllBlogsPage";
import useThemeColors from "../hooks/useThemeColors";


const Stack = createStackNavigator();

export const AllBlogsNavigator = () => {
    const themeColors = useThemeColors();

    return (
        <Stack.Navigator
            initialRouteName={'AllBlogsPage'}
            screenOptions={{headerShown: false, cardStyle: { backgroundColor: themeColors.primary }}}
        >
            <Stack.Screen name='AllBlogsPage' component={AllBlogsPage}/>

        </Stack.Navigator>
    )
}