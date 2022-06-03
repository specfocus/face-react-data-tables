export interface InputProps {
    addField?: boolean;
    defaultValue?: any;
    input?: any;
    source: string;
}

export type SetOnSave = (
    onSave?: (values: object, redirect: any) => void
) => void;

export type FormContextValue = {
    setOnSave?: SetOnSave;
    registerGroup: (name: string) => void;
    unregisterGroup: (name: string) => void;
    registerField: (source: string, group?: string) => void;
    unregisterField: (source: string, group?: string) => void;
    getGroupFields: (name: string) => string[];
};

export type FormFunctions = {
    setOnSave?: SetOnSave;
};