import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary" | "destructive" | "disabled" | "warning" | "success";
}

const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
    const baseStyle = "rounded-md shadow-md transition-all hover:scale-105 p-2 outline-none focus:outline-none";
    let variantStyle = "";

    switch (variant) {
        case "primary":
            variantStyle = "bg-gradient-to-br from-purple-400 to-purple-500 p-[10px] text-white";
            break;
        case "secondary":
            variantStyle =
                "border-2 text-slate-700 hover:bg-slate-700 hover:border-slate-700 hover:text-purple-50 dark:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900";
            break;
        case "destructive":
            variantStyle = "bg-gradient-to-br from-red-400 to-red-500 p-[10px] text-white";
            break;
        case "disabled":
            variantStyle = "bg-gray-500 text-gray-300 p-[10px] cursor-not-allowed text-white";
            break;
        case "warning":
            variantStyle = "bg-gradient-to-br from-orange-400 to-orange-500 p-[10px] text-white";
            break;
        case "success":
            variantStyle = "bg-gradient-to-br from-green-500 to-green-600 p-[10px] text-white";
            break;
    }

    return (
        <button
            {...props}
            className={`${baseStyle} ${variantStyle} ${props.className}`}
            disabled={variant === "disabled"}
        >
            {children}
        </button>
    );
};

export default Button;
