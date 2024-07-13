export const clamp = function(num: number, min: number | undefined, max: number | undefined): number {
    return Math.min(Math.max(num, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}