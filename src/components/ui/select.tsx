// FILE: src/components/ui/select.tsx
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils"; // Pastikan path utils benar

// Context untuk menyimpan value
const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

export const Select = ({ children, onValueChange, value }: any) => {
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState(value || "");

    const handleValueChange = (newValue: string) => {
        setVal(newValue);
        if (onValueChange) onValueChange(newValue);
        setOpen(false); // Tutup dropdown setelah memilih
    };

    return (
        <SelectContext.Provider
            value={{
                value: val,
                onValueChange: handleValueChange,
                open,
                setOpen,
            }}
        >
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger = ({ className, children }: any) => {
    const context = React.useContext(SelectContext);
    return (
        <button
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            onClick={() => context?.setOpen(!context.open)}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
};

export const SelectValue = ({ placeholder }: any) => {
    const context = React.useContext(SelectContext);
    // Cari label dari value (sederhana)
    return <span>{context?.value || placeholder}</span>;
};

export const SelectContent = ({ children, className }: any) => {
    const context = React.useContext(SelectContext);
    if (!context?.open) return null;

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md animate-in fade-in-80 w-full mt-1",
                className
            )}
        >
            <div className="p-1">{children}</div>
        </div>
    );
};

export const SelectItem = ({ value, children, className }: any) => {
    const context = React.useContext(SelectContext);
    const isSelected = context?.value === value;

    return (
        <div
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 cursor-pointer",
                className
            )}
            onClick={() => context?.onValueChange(value)}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            {children}
        </div>
    );
};
