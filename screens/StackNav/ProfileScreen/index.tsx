import React, { FC } from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

// NAVIGATION
import { PROFILE_SCREEN_NAME, TABS_SCREEN_NAME } from "../../../navigation/constants";
import { StackNavigatorProps } from "../../../navigation/StackNavigator";

// COMPONENTS
import Todo from "../../../components/Dev/Todo";
import BackButton from "../../../navigation/components/Buttons/BackButton";
import { ProfileHeader } from "../../../components/Navigation/NavHeader";

const ProfileScreen: FC<StackNavigatorProps<typeof PROFILE_SCREEN_NAME>> = ({ navigation }) =>
(
    <View>
        <ProfileHeader/>

        <Todo name='My name'/>

        <Todo name='Account metrics?'/>
    </View>
);

export default ProfileScreen;
