import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// Define the props for the CheckboxComponent
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string; // Text label for the checkbox
    variant: "default" | "disabled"; // Style variant of the checkbox
    defaultChecked?: boolean; // Initial checked state
}

/**
 * Custom Checkbox Component
 * Utilizes Radix UI Checkbox for accessibility and FontAwesome for icons.
 */
const CheckboxComponent: React.FC<CheckboxProps> = ({
    label,
    variant = "default",
    defaultChecked = false,
    ...props
}) => {
    // State to manage the checked status of the checkbox
    const [checked, setChecked] = React.useState(defaultChecked);

    // Base style for the checkbox, applied to all variants
    const baseCheckboxStyle =
        "flex h-6 w-6 items-center justify-center rounded-md border-2 bg-transparent outline-none transition-all";

    // Variant-specific styles
    let variantCheckboxStyle = "";
    switch (variant) {
        case "default":
            variantCheckboxStyle =
                "cursor-pointer border-slate-300 group-hover:border-purple-400 data-[state=checked]:bg-purple-400 data-[state=checked]:border-purple-400";
            break;
        case "disabled":
            variantCheckboxStyle = "border-gray-600 text-gray-600 cursor-not-allowed";
            break;
    }

    // Toggle the checked state, respecting the disabled variant
    const toggleChecked = () => {
        if (variant !== "disabled") {
            setChecked(!checked);
        }
    };

    return (
        <div className="group my-2 flex select-none items-center justify-start gap-2" onClick={toggleChecked}>
            {/* Checkbox */}
            <Checkbox.Root className={`${baseCheckboxStyle} ${variantCheckboxStyle}`} checked={checked}>
                {/* Checkbox Indicator */}
                <Checkbox.Indicator className="text-white">
                    <FontAwesomeIcon icon={faCheck} className="text-[15px]" />
                </Checkbox.Indicator>
            </Checkbox.Root>
            {/* Label */}
            <label
                className={`${variant === "disabled" ? "cursor-not-allowed text-gray-600" : "cursor-pointer"}`}
                onClick={toggleChecked}
            >
                {label}
            </label>
        </div>
    );
};

export default CheckboxComponent;
