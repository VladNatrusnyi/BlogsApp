import {createStackNavigator} from "@react-navigation/stack";
import {useDispatch, useSelector} from "react-redux";
import {RootNavigator} from "./RootNavigator";
import {AuthPage} from "../pages/AuthPage";
import {NavigationContainer} from "@react-navigation/native";
import {auth, db} from "../firebase/firebase";
import {equalTo, get, getDatabase, orderByChild, query, ref} from "firebase/database";
import {useEffect, useMemo} from 'react'
import { onAuthStateChanged } from "firebase/auth";
import {setRegisteredUser} from "../store/registerSlice";
import {BlogNavigator} from "./BlogNavigator";


const Stack = createStackNavigator();

export const AppNavigator = () => {
    const dispatch = useDispatch()

    const {registeredUser} = useSelector(state => state.register)


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // dispatch(setIsLoadingWhenCheckLoginUser(true))
            if (user) {

                const uid = user.uid;
                const userRef = ref(db, `users`);
                const sortedUsers = query(userRef, orderByChild('uid'), equalTo(uid));

                get(sortedUsers)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();

                            if (userData) {
                                const key = Object.keys(userData)[0]
                                dispatch(setRegisteredUser(userData[key]))
                                console.log(`Success getting user by id`);
                            } else {
                                dispatch(setRegisteredUser(null))
                            }


                        } else {
                            console.log(`User nor found`);
                        }
                    })
                    .catch((error) => {
                        console.error(`Error getting user by id`, error.message);
                    });
            } else {

            }
        });
        return () => unsubscribe();
    }, []);


    return (
        <>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={'RootNavigator'}
                    screenOptions={{headerShown: false}}
                >
                    <Stack.Screen name='AuthPage' component={AuthPage}/>
                    <Stack.Screen name='RootNavigator' component={RootNavigator}/>
                    <Stack.Screen name='BlogNavigator' component={BlogNavigator}/>
                </Stack.Navigator>
            </NavigationContainer>
        </>

    )
}
