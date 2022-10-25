import React, {FC} from 'react';
import {View} from 'react-native';

// NAVIGATION
import {PROFILE_SCREEN_NAME} from '../../../ssNavigation/constants';
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';

// COMPONENTS
import Todo from '../../../ssComponents/Dev/Todo';
import {ProfileHeader} from '../../../ssComponents/Navigation/NavHeader';

const ProfileScreen: FC<StackNavigatorProps<typeof PROFILE_SCREEN_NAME>> = ({
  navigation,
}) => (
  <View>
    <ProfileHeader />

    <Todo name="My name" />

    <Todo name="Account metrics?" />
  </View>
);

export default ProfileScreen;
