import React from "react";
import * as Select from "@radix-ui/react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    variant: "default" | "disabled";
    options: {
        value: string;
        label: string;
    }[];
}

const SelectComponent: React.FC<SelectProps> = ({ variant = "default", ...props }) => {
    const baseSelectStyle =
        "bg-transparent border-2 border-slate-300/30 rounded-md font-bold text-white shadow-md transition-all p-2 outline-none flex items-center justify-between gap-2";
    let variantSelectStyle = "";

    switch (variant) {
        case "default":
            variantSelectStyle = "hover:border-slate-300 focus:border-purple-500";

            break;
        case "disabled":
            variantSelectStyle = "!text-gray-600 cursor-not-allowed";
            break;
    }

    return (
        <Select.Root defaultValue={props.options[0].value} disabled={variant == "disabled"}>
            <Select.Trigger
                className={`${baseSelectStyle} ${variantSelectStyle} group data-[state=open]:border-purple-500`}
            >
                <Select.Value />
                <FontAwesomeIcon icon={faChevronDown} className="transition-all group-data-[state=open]:rotate-180" />
            </Select.Trigger>
            <Select.Content className="animate-[slideUpAndFade_0.1s_ease-in-out] rounded-md bg-slate-300 p-2 text-slate-700 will-change-[opacity,transform]">
                {props.options.map((option) => (
                    <Select.Item
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer rounded-md p-2 outline-none transition-all hover:bg-slate-200"
                    >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator />
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    );
};

export default SelectComponent;
