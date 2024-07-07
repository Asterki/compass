import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary" | "destructive" | "disabled" | "warning" | "success";
}

const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
    const baseStyle = "rounded-md font-bold text-white shadow-md transition-all hover:scale-105 p-2 ";
    let variantStyle = "";

    switch (variant) {
        case "primary":
            variantStyle = "bg-gradient-to-br from-purple-400 to-purple-500  p-2";
            break;
        case "secondary":
            variantStyle = "border-2 border-slate-300/50 hover:bg-slate-300 hover:text-slate-700";
            break;
        case "destructive":
            variantStyle = "bg-gradient-to-br from-red-400 to-red-500  p-2";
            break;
        case "disabled":
            variantStyle = "bg-gray-500 text-gray-300 p-2";
            break;
        case "warning":
            variantStyle = "bg-gradient-to-br from-orange-400 to-orange-500 p-2";
            break;
        case "success":
            variantStyle = "bg-gradient-to-br from-green-500 to-green-600 p-2";
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
