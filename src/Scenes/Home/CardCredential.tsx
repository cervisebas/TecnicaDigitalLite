import React, { createRef, useEffect } from "react";
import { Card, IconButton } from "react-native-paper";
import CardComponent, { CardComponentRef } from "../../Components/CardComponent";
import { Dimensions, EmitterSubscription, ScaledSize, StyleSheet, View } from "react-native";
import { Theme } from "../../Scripts/Theme";

type IProps = {
    dni: string;
    name: string;
    image: string;
};

export default React.memo(function CardCredential(props: IProps) {
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

    function rightButtonTitle(hProps: { size: number; }) {
        return(<IconButton
            {...hProps}
            icon={'pencil-ruler'}
            //disabled={this.props.isLoading}
            //onPress={(!this.state.isLoading)? this.loadData: undefined}
            iconColor={Theme.colors.secondary}
        />);
    }

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
                    designID={0}
                />
            </View>
        </Card.Content>
    </Card>);
});

const styles = StyleSheet.create({
    content: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 12,
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
    }
});