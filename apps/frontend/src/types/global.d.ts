declare global {
    export type KeyOf<T> = keyof T & string;

    namespace Type {
        interface CreateType<V, O = object> {
            value: V;
            options?: Partial<O>;
        }

        export type ImageSource = CreateType<{
            value: string;
            width: number;
            height: number;
        }>;

        export type Text = CreateType<string, {
            multiline: boolean;
        }>;

        export type Numeric = CreateType<number, {
            min: number;
            max: number;
        }>;

        export type Conditional = CreateType<boolean, {
            checkbox: boolean;
        }>;

        export type Color = CreateType<string>;

        // export type Select<V extends (readonly string[] | readonly number[]) = readonly string[]> = SettingType<"select", {
        //     value: string;
        //     options: V[];
        // }>;
    }

    export type SettingTypes =
        | Type.Text
        | Type.Color
        | Type.Numeric
        | Type.Conditional
        | Type.ImageSource;

    export interface MappedSettingTypes {
        text: Type.Text;
        color: Type.Color;
        numeric: Type.Numeric;
        conditional: Type.Conditional;
        image: Type.ImageSource;
    };

    export type SettingType<K extends keyof MappedSettingTypes> = MappedSettingTypes[K];

    export interface Setting<V extends SettingTypes> {
        name: string;
        options?: V["options"];
    };

    export type Settings = Record<string, SettingTypes>;

    export type SettingsList<T extends Settings> = {
        [K in keyof T]: Setting<T[K]>;
    };
}

export {};
