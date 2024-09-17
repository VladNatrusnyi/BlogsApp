import useThemeColors from "../../hooks/useThemeColors";
import {useSelector} from "react-redux";
import {useState, useMemo} from "react";
import {ref, set, push} from "firebase/database";
import FlashMessage, {showMessage} from "react-native-flash-message";
import {PageContainerWithKeyboard} from "../../containers/PageContainerWithKeyboard";
import {ContainerWithLogin} from "../../containers/ContainerWithLogin";
import {CreateBlogForm} from "../../components/Blog/CreateBlogForm";
import {AppButton} from "../../components/UI/btn/AppButton";
import {BarIndicator} from "react-native-indicators";
import {db} from "../../firebase/firebase";
import {convertLinkToUrl} from "../../func/convertLinkToUrl";
import {BackBtn} from "../../components/UI/btn/BackBtn";
import {useNavigation} from "@react-navigation/native";


export const EditBlogPage = () => {

    const navigation = useNavigation();

    const {registeredUser} = useSelector(state => state.register)
    const {openedBlogId} = useSelector(state => state.blogItem)
    const {blogsArr} = useSelector(state => state.blogs)


    const blogExistedData = useMemo(() => {
        if (blogsArr && openedBlogId) {
            return blogsArr.find(blog => blog.id === openedBlogId)
        }
    }, [blogsArr, openedBlogId])

    const themeColors = useThemeColors();

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')


    const [blogData, setBlogData] = useState({
        name: blogExistedData.name,
        description: blogExistedData.description,
        blogPhoto: blogExistedData.blogPhoto
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
            description: `Error editing blog. ${message}`,
            type: 'warning',
            duration: 3000,
            statusBarHeight: 10
        });
    };

    const showFlashMessageSuccess = () => {
        showMessage({
            message: 'Success',
            description: "The blog has been successfully updated.",
            type: 'success',
            duration: 3000,
            statusBarHeight: 10
        });
    };


    const editBlog = async () => {
        setIsLoading(true)

        const blogRef = ref(db, `blogs/${blogExistedData.id}`);

        let photoData = blogExistedData.blogPhoto

        if (blogData.blogPhoto) {
            try {
                const result = await convertLinkToUrl(blogData.blogPhoto, blogExistedData.id);
                if (result) {
                    photoData = result;
                }
            } catch (error) {
                console.error('Failed to convert link to URL:', error);
            }
        }

        set(blogRef, {
            ...blogExistedData,
            ...blogData,
            blogPhoto: photoData

        })
            .then(() => {
                setIsLoading(false)
                setError('')
                showFlashMessageSuccess()
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
                containerStyle={{flex: 1}}
            >
                <FlashMessage position="top" />
                <BackBtn onPress={() => navigation.goBack()} />

                <CreateBlogForm
                    formTitle={'Edit blog'}
                    blogData={blogData}
                    changeBlogData={changeBlogData}
                />

                {blogData.name.trim() &&
                    <AppButton
                        buttonStyle={{marginBottom: 25}}
                        text={'Edit blog'}
                        onPress={editBlog}
                    />
                }

                {
                    isLoading &&
                    <BarIndicator color={themeColors.secondary}/>
                }

            </PageContainerWithKeyboard>

        </ContainerWithLogin>
    )
}
