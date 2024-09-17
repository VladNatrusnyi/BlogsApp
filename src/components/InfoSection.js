import {ScrollView, StyleSheet, Text, View} from "react-native";
import {BlogAvatarImg} from "./UI/avatars/BlogAvatarImg";
import useThemeColors from "../hooks/useThemeColors";
import {useSelector} from "react-redux";
import {useMemo} from "react";
import {PersonAvatarImg} from "./UI/avatars/PersonAvatarImg";
import {convertOnlyDate} from "../func/convertDate";

export const InfoSection = ({blogData}) => {

    const {usersArr} = useSelector(state => state.blogs)

    const themeColors = useThemeColors();

    const authorData = useMemo(() => {
        if (blogData && usersArr) {
            return usersArr.find(el => el.uid === blogData.creatorId)
        }
    }, [blogData, usersArr])

    return (
        <View>

            <View style={styles.container}>
                {
                    blogData
                        ? <View style={styles.blogInfoWrapper}>
                            <BlogAvatarImg size={60} iconSize={30} source={blogData.blogPhoto}/>
                            <View>
                                <Text numberOfLines={1}
                                      ellipsizeMode='tail'
                                      style={[styles.name, {color: themeColors.text}]}>{blogData.name}</Text>
                                <Text
                                    style={[styles.subscribers, {color: themeColors.text}]}>{JSON.parse(blogData.subscribersNumber).length} subscribers</Text>
                            </View>
                        </View>
                        : <Text style={[styles.name, {color: themeColors.text}]}>Not found</Text>

                }
            </View>


            <View style={styles.container}>
                <Text style={[styles.label, {color: themeColors.secondary}]}>Author</Text>
                {
                    authorData
                        ? <View style={styles.blogInfoWrapper}>
                            <PersonAvatarImg size={60}  source={authorData.photo} />
                            <View>
                                <Text numberOfLines={1}
                                      ellipsizeMode='tail'
                                      style={[styles.name, {color: themeColors.text}]}>{authorData.name}</Text>
                            </View>
                        </View>
                        : <Text style={[styles.name, {color: themeColors.text}]}>Not found</Text>
                }
            </View>

            <View style={styles.container}>
                <Text style={[styles.label, {color: themeColors.secondary}]}>Date of creation</Text>
                {
                    authorData
                        ? <View style={styles.blogInfoWrapper}>
                            <View>
                                <Text numberOfLines={1}
                                      ellipsizeMode='tail'
                                      style={[styles.name, {color: themeColors.text}]}>{convertOnlyDate(blogData.creationDate)}</Text>
                            </View>
                        </View>
                        : <Text style={[styles.name, {color: themeColors.text}]}>Not found</Text>
                }
            </View>

            {
                blogData && blogData.description &&
                <View style={styles.container}>
                    <Text style={[styles.label, {color: themeColors.secondary}]}>Description</Text>
                    <ScrollView style={{
                        height: 200
                    }}>
                        <Text style={[styles.description, {color: themeColors.text}]}>{blogData.description}</Text>
                    </ScrollView>

                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 80,
        paddingHorizontal: 20,
    },

    blogInfoWrapper: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginLeft: 15,
        overflow: 'hidden',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
    },
    subscribers: {
        fontSize: 16,
    },

    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    }
})
