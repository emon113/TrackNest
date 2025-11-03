// This file defines a style object to make react-select
// match your dark mode / light mode theme.

export const selectStyles = {
    control: (styles, { isFocused }) => ({
        ...styles,
        backgroundColor: 'transparent',
        borderColor: isFocused ? '#14b8a6' : 'rgb(107 114 128 / 0.5)', // 'border-gray-500' or 'border-primary-500'
        boxShadow: isFocused ? '0 0 0 1px #14b8a6' : 'none', // 'ring-primary-500'
        '&:hover': {
            borderColor: '#14b8a6', // 'border-primary-500'
        },
        borderRadius: '0.375rem', // 'rounded-md'
    }),
    menu: (styles) => ({
        ...styles,
        backgroundColor: 'rgb(39 39 42)', // 'bg-zinc-800'
        borderRadius: '0.375rem', // 'rounded-md'
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isSelected
                ? '#14b8a6' // 'bg-primary-500'
                : isFocused
                ? 'rgb(63 63 70)' // 'bg-zinc-700'
                : 'transparent',
            color: isSelected
                ? 'rgb(24 24 27)' // 'text-zinc-900'
                : 'rgb(228 228 231)', // 'text-zinc-200'
            cursor: isDisabled ? 'not-allowed' : 'default',
            '&:hover': {
                backgroundColor: 'rgb(63 63 70)', // 'bg-zinc-700'
            },
        };
    },
    multiValue: (styles) => ({
        ...styles,
        backgroundColor: 'rgb(63 63 70)', // 'bg-zinc-700'
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: 'rgb(228 228 231)', // 'text-zinc-200'
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: 'rgb(161 161 170)', // 'text-zinc-400'
        '&:hover': {
            backgroundColor: '#ef4444', // 'bg-red-500'
            color: 'white',
        },
    }),
    input: (styles) => ({ ...styles, color: 'rgb(228 228 231)' }), // 'text-zinc-200'
    placeholder: (styles) => ({ ...styles, color: 'rgb(161 161 170)' }), // 'text-zinc-400'
    singleValue: (styles) => ({ ...styles, color: 'rgb(228 228 231)' }), // 'text-zinc-200'
};
