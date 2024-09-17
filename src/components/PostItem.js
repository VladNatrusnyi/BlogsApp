import { StyleSheet, Text, View } from "react-native";
import { convertDate } from "../func/convertDate";
import useThemeColors from "../hooks/useThemeColors";
import { IconButton } from "./UI/btn/IconButton";
import { useState, useMemo } from "react";
import { ref, set, remove } from "firebase/database";
import { db } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import { EditPostModal } from "./UI/modals/EditPostModal";

export const PostItem = ({ data }) => {

    const themeColors = useThemeColors();
    const [isShowBtn, setIsShowBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { registeredUser } = useSelector(state => state.register);
    const { usersArr } = useSelector(state => state.blogs);

    const isCreator = useMemo(() => {
        if (data && registeredUser) {
            return data.creatorId === registeredUser.uid;
        }
    }, [data, registeredUser]);

    const updateCourseLikesNumber = () => {
        if (data && registeredUser) {
            setIsLoading(true);
            const courseRef = ref(db, `posts/${data.id}`);
            const updatedData = {
                ...data,
                likes: data.likes.includes(registeredUser.id)
                  ? JSON.stringify(JSON.parse(data.likes)
                    .filter(el => el !== registeredUser.id)
                    .filter((el) => !usersArr.includes(el)))
                  : JSON.stringify([...JSON.parse(data.likes), registeredUser.id])
            };
            set(courseRef, updatedData)
              .then(() => {
                  setIsLoading(false);
                  console.log(`Likes successfully updated`);
              })
              .catch((error) => {
                  setIsLoading(false);
                  setError(error.message);
                  console.error(`Error updating Likes number`, error);
              });
        }
    };

    const deletePost = async () => {
        setIsLoading(true);
        try {
            const postRef = ref(db, `posts/${data.id}`);
            await remove(postRef);
            setIsLoading(false);
            console.log('Success');
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const onMenuItemPress = (action) => {
        if (action.event === 'edit') {
            openModal();
        }

        if (action.event === 'delete') {
            deletePost();
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const closeModal = () => setModalVisible(false);
    const openModal = () => setModalVisible(true);

    return (
      <>
          <EditPostModal visible={modalVisible} onClose={closeModal} payload={data} />
          <View style={styles.postItemContainer}>
              <View style={styles.contentWrapper}>
                  <View style={[styles.wrapper, { borderColor: themeColors.primaryDark, backgroundColor: themeColors.primaryDark }]}>
                      {isCreator && (
                        <MenuView
                          style={styles.menu}
                          title="Post settings"
                          onPressAction={({ nativeEvent }) => {
                              onMenuItemPress(nativeEvent);
                          }}
                          actions={[
                              { id: 'edit', title: 'Edit' },
                              { id: 'delete', title: 'Delete' }
                          ]}
                          shouldOpenOnLongPress={false}
                        >
                            <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color={themeColors.text} />
                        </MenuView>
                      )}

                      <Text style={{ color: themeColors.text }}>{JSON.parse(data.content)}</Text>
                  </View>
                  <Text style={[styles.dateText, { color: themeColors.secondary }]}>
                      {convertDate(data.creationDate)}
                  </Text>
              </View>

              <View style={styles.likeSection}>
                  <IconButton
                    name={registeredUser && JSON.parse(data.likes).includes(registeredUser.id) ? 'heart' : 'hearto'}
                    color={themeColors.secondary}
                    size={22}
                    onPress={updateCourseLikesNumber}
                  />
                  <Text style={[styles.likesText, { color: themeColors.secondary }]}>
                      {JSON.parse(data.likes).length}
                  </Text>
              </View>
          </View>
      </>
    );
};

const styles = StyleSheet.create({
    postItemContainer: {
        marginBottom: 15,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    contentWrapper: {
        flex: 1,
    },
    wrapper: {
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        marginBottom: 5,
        flexDirection: 'row',
        gap: 5,
    },
    menu: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    dateText: {
        alignSelf: 'flex-end',
    },
    likeSection: {
        alignItems: 'center',
        gap: 5,
    },
    likesText: {
        fontSize: 16,
    },
});
