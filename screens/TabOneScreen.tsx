import React, { forwardRef, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListViewBase, ScrollView, StyleSheet, TextInput } from 'react-native';

// import EditScreenInfo from '../components/EditScreenInfo';
// import { RootTabScreenProps } from '../types';

import { useList } from '../hooks/useList';
import GrowingInputList from '../components/Input/GrowingInputList';
import StandardInputList from '../components/Input/StandardInputList';
import { View } from 'react-native';
import styled from 'styled-components';

const renderInput = (props: any) => {
    const { list, item, index, push, rm, replace } = props;

    return index < list.length ? <StyledTextInput placeholder={'Should have been deleted'} value={item.title} onChangeText={(newText: string) => newText.length == 0 ? rm(index) : replace(index, { title: newText, id: index })} />
    :
    <StyledTextInput placeholder={`${index} - ${list.length} `} value={item.title} onChangeText={(newText: string) => push({ title: newText, id: index })} />
};

const renderLastInput = (props: any) => {
    const { item, index, push } = props;

    return <TextInput placeholder={`Add item ${index}`} onChangeText={(newText: string) => push({ id: index, title: newText })} />;
};

const StyledTextInput = styled(TextInput)`
    border-color: red;
`;

// export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    export default function TabOneScreen() {
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
        setLastInputId((prevId) => prevId + 1);
    };
    const pushLastInput = (newObj: any) => {
        push({
            title: newObj.title,
            id: `${lastInputId}`,
        });

        updateLastInput();
    }

    return (
        <View>
            <TextInput placeholder='here' />

            {/* <Text style={styles.title}>Tab One</Text>
            <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' /> */}
            <GrowingInputList
                list={list}
                renderInput={renderInput}
                lastInput={{
                    title: '',
                    id: `${lastInputId}`,
                }}
                keyExtractor={(item) => item.id}
                push={pushLastInput}
                rm={rm}
                replace={replace}
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
