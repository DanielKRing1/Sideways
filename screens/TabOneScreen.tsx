import { FlatList, ScrollView, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useList } from '../hooks/useList';
import GrowingInputList from '../components/Input/GrowingInputList';
import StandardInputList from '../components/Input/StandardInputList';
import { useState } from 'react';
import styled from 'styled-components';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const { list, push, rm, replace } = useList([
        {
            title: 'Title 0',
            id: '0',
        },
        {
            title: 'Title 1',
            id: '1',
        },
    ]);

    const [lastInputId, setLastInputId] = useState(list.length);
    const updateLastInput = () => {
        push({
            title: `Title ${lastInputId}`,
            id: `${lastInputId}`,
        });
        setLastInputId((prevId) => prevId + 1);
    };

    const renderItem = (props) => {
        const { item, index } = props;

        return <StyledTextInput placeholder={'Add item'} value={item.title} onChangeText={(newText: string) => replace(index, { title: newText, id: index })} />;
    };

    const StyledTextInput = styled(TextInput)`
        border-color: red;
    `;

    return (
        <View>
            {/* <Text style={styles.title}>Tab One</Text>
            <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' /> */}
            <GrowingInputList
                list={list}
                renderItem={renderItem}
                updateLastInput={updateLastInput}
                lastInput={{
                    title: '',
                    id: `${lastInputId}`,
                }}
                keyExtractor={(item) => item.id}
            />
            {/* <EditScreenInfo path='/screens/TabOneScreen.tsx' /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
