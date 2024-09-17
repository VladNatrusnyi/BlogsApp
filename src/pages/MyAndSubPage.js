import { StyleSheet, Text} from "react-native";
import {useSelector} from "react-redux";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ContainerWithLogin} from "../containers/ContainerWithLogin";
import BlogList from "../components/Blog/BlogList";
import {useMemo} from 'react'
import useThemeColors from "../hooks/useThemeColors";

export const MyAndSubPage = () => {

    const navigation = useNavigation();

    const themeColors = useThemeColors();

    const {registeredUser} = useSelector(state => state.register)
    const {blogsArr} = useSelector(state => state.blogs)

    const currentRouteName = useRoute().name;

    const filteredBlogs = useMemo(() => {
        if (blogsArr && registeredUser) {
            if (currentRouteName === 'My Blogs') {
                return blogsArr.filter(blog => blog.creatorId === registeredUser.uid)
            }

            if (currentRouteName === 'My Subscriptions') {
                return blogsArr.filter(blog => JSON.parse(blog.subscribersNumber).includes(registeredUser.id))
            }
        }
    }, [blogsArr, currentRouteName])


    return (
        <ContainerWithLogin paddingHorizontal={0}>
            <Text style={[styles.title, {color: themeColors.secondary}]}>{currentRouteName}</Text>
                {
                    filteredBlogs && <BlogList blogsArr={filteredBlogs}/>
                }
        </ContainerWithLogin>

    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
})
