import React, { createRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button, Card, IconButton } from "react-native-paper";
import CardComponent, { CardComponentRef } from "../../Components/CardComponent";
import { Dimensions, EmitterSubscription, ScaledSize, StyleSheet, View } from "react-native";
import { Theme } from "../../Scripts/Theme";
import { safeDecode } from "../../Scripts/Utils";
import Color from "color";

type IProps = {
    dni: string;
    name: string;
    curse: string;
    image: string;
    openChangeDesign: ()=>void;
};
export type CardCredentialRef = {
    setDesign: (id: number)=>void
};

export default React.memo(forwardRef(function CardCredential(props: IProps, ref: React.Ref<CardCredentialRef>) {
    const [disable, setDisable] = useState(false);
    const [design, setDesign] = useState(0);
    const refCardComponent = createRef<CardComponentRef>();
    var event: EmitterSubscription | undefined = undefined;

    function setNewScaleCard({ window }: { window: ScaledSize; }) {
        let width = window.width - 58;
        let finding = true;
        let scaleImage = 1;
        while (finding) {
            if ((1200 * scaleImage) < width) {
                refCardComponent.current?.setScale(scaleImage);
                finding = false;
            } else {
                scaleImage -= 0.001;
            }
        }
    }

    useEffect(()=>{
        event = Dimensions.addEventListener('change', setNewScaleCard);
        let window = Dimensions.get('window');
        setNewScaleCard({ window });
        return ()=>{
            event?.remove();
        };
    }, []);
    useEffect(()=>{
        let curse = safeDecode(props.curse).toLowerCase();
        setDisable(curse.indexOf('docente') !== -1);
    }, [props.curse]);

    function rightButtonTitle(hProps: { size: number; }) {
        return(<IconButton
            {...hProps}
            icon={'pencil-ruler'}
            onPress={(!disable)? props.openChangeDesign: undefined}
            iconColor={(disable)? Color(Theme.colors.tertiary).alpha(0.5).rgb().string(): Theme.colors.secondary}
        />);
    }
    useImperativeHandle(ref, ()=>({ setDesign }));

    return(<Card style={styles.content}>
        <Card.Title
            title={'Tarjeta de ingreso:'}
            titleStyle={styles.title}
            titleVariant={'titleMedium'}
            right={rightButtonTitle}
        />
        <Card.Content>
            <View style={styles.contentCard}>
                <CardComponent
                    ref={refCardComponent}
                    dni={props.dni}
                    name={props.name}
                    image={props.image}
                    designID={design}
                />
            </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
            <Button icon={'cloud-download-outline'}>Descargar</Button>
            <Button icon={'share-variant-outline'}>Compartir</Button>
        </Card.Actions>
    </Card>);
}));

const styles = StyleSheet.create({
    content: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10,
        overflow: 'hidden'
    },
    title: {
        fontWeight: '600',
        fontSize: 20
    },
    contentCard: {
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 12
    },
    cardActions: {
        justifyContent: 'flex-end'
    }
});