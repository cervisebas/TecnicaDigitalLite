import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Pressable, PressableAndroidRippleConfig } from "react-native";
import DesingsCards from "../Scripts/DesingsCards";
import CardEstructure from "./CardEstructure";
import { DesingsCardsType } from "../Scripts/DesingsCardsType";
import { getForScale } from "../Scripts/Utils";
import ViewShot from "react-native-view-shot";

type IProps = {
    name: string;
    image: string;
    dni: string;
    designID: number;
    refShot?: React.RefObject<ViewShot>;
};
export type CardComponentRef = {
    setScale: (s: number)=>void;
};

const pressableRipple: PressableAndroidRippleConfig = { color: 'rgba(0, 0, 0, 0.5)', foreground: true };

export default React.memo(forwardRef(function CardComponent(props: IProps, ref: React.Ref<CardComponentRef>) {
    const [scale, setScale] = useState(0.3);

    useImperativeHandle(ref, ()=>({ setScale }));

    function getDesignForID(id: number) {
        const findDesign = (v: DesingsCardsType)=>v.id == id;
        const designEstructure = DesingsCards.find(findDesign);
        return (designEstructure)? designEstructure: DesingsCards[0];
    }

    return(<ViewShot ref={props.refShot} style={{ position: 'relative', width: getForScale(scale, 1200), height: getForScale(scale, 779), overflow: 'hidden' }}>
        <CardEstructure
            scale={scale}
            dni={props.dni}
            name={props.name}
            image={props.image}
            designEstructure={getDesignForID(props.designID)}
        />
    </ViewShot>);
}));