export interface IFilterMenuOption {
    value?: number | boolean;
    label?: string;
}

export interface IFilterChange {
    checked?: boolean;
    option?: IFilterMenuOption;
}