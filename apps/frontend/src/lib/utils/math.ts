export const MathHelper = {
    clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    },
    distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    sizeOfRotatedRect(width: number, height: number, radians: number) {
        return {
            width: Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians)),
            height: Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians)),
        };
    },
};

export default MathHelper;
