import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "error" | "success" | "disabled";
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ variant = "default", children, ...props }) => {
    let variantStyle = "";
    const baseStyle = "rounded-md border-2 bg-transparent p-2 outline-none transition-all border-slate-200/30 ";

    switch (variant) {
        case "default":
            variantStyle = "hover:border-slate-200/50 focus:border-purple-500";
            break;
        case "error":
            variantStyle = "hover:border-red-500/70 focus:border-red-500";
            break;
        case "success":
            variantStyle = "hover:border-green-500/70 focus:border-green-500";
            break;
        case "disabled":
            variantStyle = "hover:border-gray-500/70 focus:border-gray-500";
            break;
    }

    return (
        <input
            {...props}
            type="text"
            disabled={variant === "disabled"}
            className={`${baseStyle} ${variantStyle} ${props.className}`}
        />
    );
};

export default Input;
