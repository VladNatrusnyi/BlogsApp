
import {createStackNavigator} from "@react-navigation/stack";
import {MainBlogPage} from "../pages/BlogNavigator/MainBlogPage";
import {useNavigation} from "@react-navigation/native";
import useThemeColors from "../hooks/useThemeColors";
import {BlogHeaderBar} from "../components/headers/BlogHeaderBar";
import {EditBlogPage} from "../pages/BlogNavigator/EditBlogPage";

const Stack = createStackNavigator();

export const BlogNavigator = () => {

    const navigation = useNavigation();
    const themeColors = useThemeColors();

    return (
        <Stack.Navigator
            initialRouteName={'MainBlogPage'}
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: themeColors.primaryDark,
                },
                headerTintColor: themeColors.text,
            }}
        >
            <Stack.Screen
                name='MainBlogPage'
                component={MainBlogPage}
                options={{
                    headerShown: false,
                    header: () => <BlogHeaderBar navigation={navigation}/>,
                    cardStyle: { backgroundColor: themeColors.primary },
                }}
            />
            <Stack.Screen
                name='EditBlogPage'
                component={EditBlogPage}
                options={{
                    headerShown: false,
                    header: () => <BlogHeaderBar navigation={navigation}/>,
                    cardStyle: { backgroundColor: themeColors.primary },
                }}
            />
        </Stack.Navigator>
    )
}


