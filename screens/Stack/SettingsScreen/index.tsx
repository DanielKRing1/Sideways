import React, { FC } from "react";
import { View, Text, Button } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

// NAVIGATION
import { TABS_SCREEN_NAME, SETTINGS_SCREEN_NAME } from "../../../navigation/constants";
import { StackNavigatorProps } from "../../../navigation/StackNavigator";

// COMPONENTS
import Todo from "../../../components/Dev/Todo";

const SettingsScreen: FC<StackNavigatorProps<typeof SETTINGS_SCREEN_NAME>> = ({ navigation }) => (
    <View>
        <Button
            title="<"
            onPress={() => navigation.navigate(TABS_SCREEN_NAME)}
        />

        <Todo name='?'/>
    </View>
);

export default SettingsScreen;
