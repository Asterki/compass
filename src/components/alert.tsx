import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faTimes, faWarning, faCheck } from '@fortawesome/free-solid-svg-icons'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: 'info' | 'destructive' | 'warning' | 'success'
    showing: boolean
}

/*
 * A component that displays an alert message.
 *
 * @param variant - The variant of the alert.
 */
const AlertComponent: React.FC<AlertProps> = ({ variant, showing, children, ...props }) => {
    const baseStyle =
        'w-11/12 md:w-4/12 left-4 rounded-md shadow-md items-center justify-start transition-all fixed bottom-4 outline-none focus:outline-none' +
        (showing ? ' opacity-100 flex ' : ' opacity-0 hidden')
    let variantStyle = ''
    let icon = null

    switch (variant) {
        case 'info':
            variantStyle = 'bg-gradient-to-br from-blue-400 to-blue-500 p-[10px] text-white'
            icon = faInfo
            break
        case 'destructive':
            variantStyle = 'bg-gradient-to-br from-red-400 to-red-500 p-[10px] text-white'
            icon = faTimes
            break
        case 'warning':
            variantStyle = 'bg-gradient-to-br from-orange-400 to-orange-500 p-[10px] text-white'
            icon = faWarning
            break
        case 'success':
            variantStyle = 'bg-gradient-to-br from-green-500 to-green-600 p-[10px] text-white'
            icon = faCheck
            break
    }

    return (
        <div {...props} className={`${baseStyle} ${variantStyle} ${props.className}`}>
            <FontAwesomeIcon className="text-4xl w-8 h-8" icon={icon} />
            <span className="ml-4">{children}</span>
        </div>
    )
}

export default AlertComponent
