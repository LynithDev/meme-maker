export const MathHelper = {
    clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    },
    distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
};

export default MathHelper;
