import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Modal, Text } from "react-native-paper";
import { Theme } from "../Scripts/Theme";

type IProps = {};
export type LoadingComponentRef = {
    open: (message: string)=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function LoadingComponent(_props: IProps, ref: React.Ref<LoadingComponentRef>) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('Cargando...');

    function open(mess: string) {
        setVisible(true);
        setMessage(mess);
    }
    function close() {
        setVisible(false);
    }

    useImperativeHandle(ref, ()=>({ open, close }));

    return(<Modal visible={visible} dismissable={false} style={styles.modal}>
        <View style={styles.content}>
            <ActivityIndicator size={'large'} />
            <Text style={styles.message}>{message}</Text>
        </View>
    </Modal>);
}));

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.elevation.level3,
        alignSelf: 'flex-start',
        paddingBottom: 24,
        paddingTop: 24,
        paddingLeft: 32,
        paddingRight: 32,
        elevation: 24,
        borderRadius: 7 * Theme.roundness,
        maxWidth: 350
    },
    message: {
        marginLeft: 24,
        fontSize: 16
    },
    modal: {
        //alignSelf: 'flex-start',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});