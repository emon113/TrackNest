export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label
            {...props}
            // --- THIS IS THE FIX ---
            // We added 'dark:text-gray-300'
            className={
                `block font-medium text-sm text-gray-700 dark:text-gray-300 ` + className
            }
        >
            {value ? value : children}
        </label>
    );
}
