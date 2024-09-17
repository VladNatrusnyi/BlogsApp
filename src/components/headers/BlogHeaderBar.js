import {SafeAreaView, StyleSheet, View, Text} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {IconButton} from "../UI/btn/IconButton";
import useThemeColors from "../../hooks/useThemeColors";
import {useSelector} from "react-redux";
import {useMemo, useState} from "react";
import {BlogAvatarImg} from "../UI/avatars/BlogAvatarImg";
import {MenuView} from '@react-native-menu/menu';
import {ref, set, equalTo, get, orderByChild, query, remove} from "firebase/database";
import {db} from "../../firebase/firebase";


export const BlogHeaderBar = ({navigation, clickToInfo = () => {}}) => {
    const themeColors = useThemeColors();

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const {registeredUser} = useSelector(state => state.register)
    const {openedBlogId} = useSelector(state => state.blogItem)
    const {blogsArr, usersArr} = useSelector(state => state.blogs)


    const blogData = useMemo(() => {
        if (blogsArr && openedBlogId) {
            return blogsArr.find(blog => blog.id === openedBlogId)
        }
    }, [blogsArr, openedBlogId])

    const isCreator = useMemo(() => {
        if (blogData && registeredUser) {
            return blogData.creatorId === registeredUser.uid;
        }
    }, [blogData, registeredUser])

  const onMenuItemPress = (action) => {
    switch (action.event) {
      case 'editBlog':
        navigation.navigate('EditBlogPage');
        break;

      case 'info':
        clickToInfo();
        break;

      case 'unsubscribe':
        unsubscribe();
        break;

      case 'deleteBlog':
        deleteBlogFunc();
        break;

      default:
        break;
    }
  };


  const unsubscribe = () => {
        if (blogData && registeredUser && usersArr) {
            setIsLoading(true)
            const blogRef = ref(db, `blogs/${blogData.id}`);
            const updatedData = {
                ...blogData,
                subscribersNumber: blogData.subscribersNumber.includes(registeredUser.id)
                    ? JSON.stringify(JSON.parse(blogData.subscribersNumber)
                        .filter(el => el !== registeredUser.id)
                        .filter((el) => !usersArr.includes(el)))
                    : JSON.stringify([...JSON.parse(blogData.subscribersNumber), registeredUser.id])
            }
            set(blogRef, updatedData)
                .then(() => {
                    setIsLoading(false)
                    console.log(`Subscribtions successfully updated`);
                })
                .catch((error) => {
                    setIsLoading(false)
                    setError(error.message)
                    console.error(`Error updating Subscribtions`, error);
                });
        }
    }

    const deleteBlogFunc = async () => {
        setIsLoading(true)
        try {

            const blogRef = ref(db, `blogs/${blogData.id}`);
            await remove(blogRef);


            const postsRef = ref(db, 'posts');
            const postsToDeleteRef = query(postsRef, orderByChild('blogId'), equalTo(blogData.id));

            const snapshot = await get(postsToDeleteRef);

            if (snapshot.val()) {
                for (const [childSnapshotKey, childSnapshot] of Object.entries(snapshot.val())) {
                    await remove(ref(db, `posts/${childSnapshotKey}`));
                }
            }

            setIsLoading(false);

            navigation.navigate('RootNavigator');

        } catch (error) {
            setError(`Error deleting account: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, {backgroundColor: themeColors.primaryDark,}]}>
            <SafeAreaView>
                <View style={styles.wrapper}>
                    <IconButton
                        name={'left'}
                        color={themeColors.text}
                        size={30}
                        onPress={() => {
                            navigation.goBack()
                        }}
                    />

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

                    <View
                        style={{width: 50, alignItems: 'flex-end'}}
                    >
                        <MenuView
                            title="Blog settings"
                            onPressAction={({nativeEvent}) => {
                                onMenuItemPress(nativeEvent)
                            }}
                            actions={
                                isCreator
                                    ? [
                                        {
                                            id: 'editBlog',
                                            title: 'Edit Blog',
                                        },

                                        {
                                            id: 'deleteBlog',
                                            title: 'Delete Blog',
                                            attributes: {
                                                destructive: true,
                                            },
                                        },
                                    ]
                                    : blogData && registeredUser && !JSON.parse(blogData.subscribersNumber).includes(registeredUser.id)
                                        ? [
                                            {
                                                id: 'info',
                                                title: 'Info',
                                            },
                                        ]
                                        : [
                                            {
                                                id: 'info',
                                                title: 'Info',
                                            },
                                            {
                                                id: 'unsubscribe',
                                                title: 'Unsubscribe',
                                            },
                                        ]

                            }
                            shouldOpenOnLongPress={false}
                        >
                            <MaterialCommunityIcons name="dots-vertical" size={30} color={themeColors.text}/>
                        </MenuView>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
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
        // width: '50%',
        flexDirection: 'row',
        flex: 1,
        gap: 15,
        alignItems: 'center',
        marginLeft: 15,
        overflow: 'hidden',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subscribers: {
        fontSize: 16,
    },
})
