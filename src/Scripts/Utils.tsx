export function waitTo(wait: number): Promise<void> {
    return new Promise((resolve)=>setTimeout(resolve, wait));
}