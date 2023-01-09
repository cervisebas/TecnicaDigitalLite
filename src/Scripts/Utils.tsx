import { decode } from "base-64";

export function waitTo(wait: number): Promise<void> {
    return new Promise((resolve)=>setTimeout(resolve, wait));
}
export function safeDecode(str: string) {
    try {
        return decode(str);
    } catch  {
        return str;
    }
}
export function getForScale(scale: number, size: number) {
    return ((scale * size) / 1);
}