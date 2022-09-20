import React, { FC } from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

// NAVIGATION
import { TABS_SCREEN_NAME, SETTINGS_SCREEN_NAME } from "../../../navigation/constants";
import { StackNavigatorProps } from "../../../navigation/StackNavigator";

// COMPONENTS
import Todo from "../../../components/Dev/Todo";
import BackButton from "../../../navigation/components/Buttons/BackButton";
import { SettingsHeader } from "../../../components/Navigation/NavHeader";

const SettingsScreen: FC<StackNavigatorProps<typeof SETTINGS_SCREEN_NAME>> = ({ navigation }) => (
    <View>
        <SettingsHeader/>

        <Todo name='?'/>
    </View>
);

export default SettingsScreen;
