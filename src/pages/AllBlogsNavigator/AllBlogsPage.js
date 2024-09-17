import {StyleSheet, View} from "react-native";
import useThemeColors from "../../hooks/useThemeColors";
import {useDispatch, useSelector} from "react-redux";
import {db} from "../../firebase/firebase";
import {useState, useEffect, useMemo, useCallback, useRef} from "react";
import {ref, onValue} from "firebase/database";
import {setBlogsArr, setPostsArr, setUsersArr} from "../../store/blogsSlice";
import {BarIndicator} from "react-native-indicators";
import {showMessage} from "react-native-flash-message";
import BlogList from "../../components/Blog/BlogList";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setTheme} from "../../store/themeSlice";


export const AllBlogsPage = () => {
    const themeColors = useThemeColors();
    const {registeredUser} = useSelector(state => state.register)
    const {blogsArr, search} = useSelector(state => state.blogs)

    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const filteredBlogs = useMemo(() => {
        if (blogsArr) {
            if (search) {
                return blogsArr.filter(blog => blog.name.toLowerCase().includes(search.toLowerCase()))
            } else {
                return blogsArr
            }
        }
    }, [blogsArr, search])

    const checkAndSetTheme = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('theme');
            if (storedTheme) {
                dispatch(setTheme(storedTheme))
            } else {
                await AsyncStorage.setItem('theme', 'dark');
            }
        } catch (error) {
            console.error('Error AsyncStorage:', error);
        }
    };


    const showFlashMessage = (message) => {
        showMessage({
            message: 'Warning',
            description: `Error getting blogs. ${message}`,
            type: 'warning',
            duration: 3000,
            statusBarHeight: 10
        });
    };


    const followChangesBlogsOnDB = () => {
        setIsLoading(true);
        const coursesRef = ref(db, 'blogs');

        onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const blogsArray = Object.keys(data).map((key) => data[key]);
                dispatch(setBlogsArr(blogsArray));
            } else {
                dispatch(setBlogsArr(null));
            }
            setIsLoading(false);
            setError('');
        }, (error) => {
            setError(error.message);
            showFlashMessage(error.message)
            setIsLoading(false);
        });
    };

    const followChangesPostsOnDB = () => {
        setIsLoading(true);
        const coursesRef = ref(db, 'posts');

        onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const blogsArray = Object.keys(data).map((key) => data[key]);
                dispatch(setPostsArr(blogsArray));
            } else {
                dispatch(setPostsArr(null));
            }
            setIsLoading(false);
            setError('');
        }, (error) => {
            setError(error.message);
            showFlashMessage(error.message)
            setIsLoading(false);
        });
    };

    const followChangesUsersOnDB = () => {
        setIsLoading(true);
        const coursesRef = ref(db, 'users');

        onValue(coursesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const usersArray = Object.keys(data).map((key) => data[key]);
                dispatch(setUsersArr(usersArray));
            } else {
                dispatch(setUsersArr(null));
            }
            setIsLoading(false);
            setError('');
        }, (error) => {
            setError(error.message);
            showFlashMessage(error.message)
            setIsLoading(false);
        });
    };

    useEffect(() => {
        checkAndSetTheme()
    }, [])

    useEffect(() => {
        followChangesBlogsOnDB();
        followChangesPostsOnDB()
        followChangesUsersOnDB()
    }, [registeredUser]);


    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => [400], []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index) => {
    }, []);
    const handleCloseModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    return (
        <BottomSheetModalProvider>
            <View style={styles.mainWrapper}>

                {
                    isLoading &&
                    <View style={{marginTop: 20}}>
                        <BarIndicator color={themeColors.secondary}/>
                    </View>
                }

                {
                    filteredBlogs && <BlogList blogsArr={filteredBlogs}/>
                }
                <BottomSheetModal
                    backgroundStyle={{backgroundColor: themeColors.primaryDark}}
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    {/*<View style={{padding: 20}}>*/}
                    {/*    <InfoSection blogData={blogData}/>*/}
                    {/*</View>*/}

                </BottomSheetModal>

            </View>
        </BottomSheetModalProvider>
    )
}

const styles = StyleSheet.create({
    mainWrapper: {
        paddingVertical: 20
    },
})
