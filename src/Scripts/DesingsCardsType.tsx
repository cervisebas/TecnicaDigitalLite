export type DesingsCardsType = {
    id: number;
    background: any;
    barcode: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    image?: {
        x: number;
        y: number;
        width: number;
        height: number;
        borderRadius: number;
        borderWidth?: number;
        borderColor?: string;
    };
    name: {
        x: number;
        y: number;
        width: number;
        height?: number;
        color: string;
        fontSize: number;
        fontFamily?: string;
        fontWeight?: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
        textAlign?: "auto" | "center" | "left" | "right" | "justify";
        textShadowColor?: string;
        textShadowOffset?: {
            width: number;
            height: number;
        };
        textShadowRadius?: number;
        maxNumberLines?: number;
    };
};