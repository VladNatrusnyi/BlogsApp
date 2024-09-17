import {ContainerWithLogin} from "../containers/ContainerWithLogin";
import {useState} from "react";
import {PageContainerWithKeyboard} from "../containers/PageContainerWithKeyboard";
import {CreateBlogForm} from "../components/Blog/CreateBlogForm";
import useThemeColors from "../hooks/useThemeColors";
import {useSelector} from "react-redux";
import { ref, set, push } from "firebase/database";
import FlashMessage, {showMessage} from "react-native-flash-message";
import {db} from "../firebase/firebase";
import {AppButton} from "../components/UI/btn/AppButton";
import {BarIndicator} from "react-native-indicators";
import {convertLinkToUrl} from "../func/convertLinkToUrl";
import {useNavigation} from "@react-navigation/native";

export const CreateBlogPage = () => {

    const navigation = useNavigation();

    const themeColors = useThemeColors();
    const {registeredUser} = useSelector(state => state.register)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')


    const [blogData, setBlogData] = useState({
        name: '',
        description: '',
        blogPhoto: ''
    });

    const changeBlogData = (data) => {
        setBlogData({...blogData, ...data})
    }

    const clearData = () => setBlogData({
        name: '',
        description: '',
        blogPhoto: ''
    })

    const showFlashMessage = (message) => {
        showMessage({
            message: 'Warning',
            description: `Error creating blog. ${message}`,
            type: 'warning',
            duration: 3000,
            statusBarHeight: 10
        });
    };


    const createNewBlog = async () => {
        setIsLoading(true)
        const questionRef = ref(db, 'blogs');

        const newQuestionIdRef = await push(questionRef);

        let photoData = ''

        if (blogData.blogPhoto) {
            try {
                const result = await convertLinkToUrl(blogData.blogPhoto, newQuestionIdRef.key);
                if (result) {
                    photoData = result;
                }
            } catch (error) {
                console.error('Failed to convert link to URL:', error);
            }
        }


        set(newQuestionIdRef, {
            id: newQuestionIdRef.key,
            creatorId: registeredUser.uid,
            creationDate: Date.now(),
            subscribersNumber: JSON.stringify([]),
            ...blogData,
            blogPhoto: photoData

        })
            .then(() => {
                setIsLoading(false)
                setError('')
                navigation.navigate('AllBlogsPage')
                clearData()
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
                showFlashMessage(error.message)
            });
    }

    return (
        <ContainerWithLogin>
            <PageContainerWithKeyboard
                containerStyle={{flex: 1, marginBottom: 30}}
            >

                <FlashMessage position="top" />

                <CreateBlogForm
                    formTitle={'Create blog'}
                    blogData={blogData}
                    changeBlogData={changeBlogData}
                />

                {blogData.name.trim() &&
                    <AppButton
                        buttonStyle={{marginBottom: 25}}
                        text={'Create blog'}
                        onPress={createNewBlog}
                    />
                }


                {
                    isLoading &&
                    <BarIndicator color={themeColors.secondary} />
                }

            </PageContainerWithKeyboard>

        </ContainerWithLogin>
    )
}

