import {useSelector} from "react-redux";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {AppInput} from "../../components/UI/inputs/AppInput";
import {useState, useMemo, useRef, useCallback} from 'react'
import {BlogHeaderBar} from "../../components/headers/BlogHeaderBar";
import {useNavigation} from "@react-navigation/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import useThemeColors from "../../hooks/useThemeColors";
import {push, ref, set} from "firebase/database";
import {db} from "../../firebase/firebase";
import FlashMessage, {showMessage} from "react-native-flash-message";
import {PostItem} from "../../components/PostItem";
import {KeyboardWrap} from "../../containers/KeyboardWrap";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {InfoSection} from "../../components/InfoSection";
import {AppButton} from "../../components/UI/btn/AppButton";

export const MainBlogPage = () => {

    const navigation = useNavigation();

    const themeColors = useThemeColors();

    const {openedBlogId} = useSelector(state => state.blogItem)
    const {registeredUser} = useSelector(state => state.register)
    const {postsArr, blogsArr, usersArr} = useSelector(state => state.blogs)

    const blogPosts = useMemo(() => {
        if (postsArr && openedBlogId) {
            return postsArr.filter(blog => blog.blogId === openedBlogId).sort((a, b) => a.creationDate - b.creationDate)
        }
    }, [postsArr, openedBlogId])

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



    const [postText, setPostText] = useState('')

    const [isFocused, setIsFocused] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const showErrorMessage = (message) => {
        showMessage({
            message: 'Warning',
            description: `Error creating post. ${message}`,
            type: 'warning',
            duration: 3000,
            statusBarHeight: 10
        });
    };

    const createNewPost = async () => {
        setIsLoading(true)
        const postRef = ref(db, 'posts');

        const postIdRef = await push(postRef);

        set(postIdRef, {
            id: postIdRef.key,
            creatorId: registeredUser.uid,
            creationDate: Date.now(),
            blogId: openedBlogId,
            content: JSON.stringify(postText),
            likes: JSON.stringify([]),

        })
            .then(() => {
                setIsLoading(false)
                setError('')
                setPostText('')
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
                showErrorMessage(error.message)
            });
    }


    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => [600], []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index) => {
    }, []);
    const handleCloseModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);


    const subscribe = () => {
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


    return (
        <KeyboardWrap
            paddingHorizontal={0}
            containerStyle={{flex: 1, justifyContent: 'space-between'}}
        >
            <BottomSheetModalProvider>
                <FlashMessage position="top" />

                <BlogHeaderBar navigation={navigation} clickToInfo={handlePresentModalPress}/>

                {
                    !isCreator && registeredUser && blogData && !JSON.parse(blogData.subscribersNumber).includes(registeredUser.id) &&
                    <AppButton
                        buttonStyle={{marginTop: 10, marginHorizontal: 20}}
                        text={'Subscribe'}
                        onPress={subscribe}
                    />
                }

                <ScrollView style={styles.body}>
                    {
                        blogPosts && blogPosts.length
                            ? blogPosts.map(blog => {
                                return (
                                    <PostItem key={blog.id} data={blog} />
                                )
                            })
                            : <Text style={{textAlign: 'center', color: themeColors.text}}>This blog has no posts yet.</Text>

                    }
                </ScrollView>


                {
                    isCreator &&
                    <View style={{paddingHorizontal: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <AppInput
                            // isError={!!error}
                            onChangeValue={(text) => setPostText(text)}
                            value={postText}
                            placeholderText={'type...'}
                            iconName={'pen-tool'}
                            inputStyle={{marginBottom: isFocused ? 10 : 30, width: '85%'}}
                            multiline={true}
                            focus={() => setIsFocused(true)}
                            blur={() => setIsFocused(false)}
                        />

                        <TouchableOpacity
                            disabled={!postText.trim()}
                            onPress={createNewPost}>
                            <MaterialCommunityIcons name="send" size={30} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>
                }



                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: themeColors.primaryDark}}
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    <View style={{padding: 20}}>
                        <InfoSection blogData={blogData} />
                    </View>

                </BottomSheetModal>
            </BottomSheetModalProvider>
        </KeyboardWrap>
    )

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        overflow: 'hidden'
    },
})
