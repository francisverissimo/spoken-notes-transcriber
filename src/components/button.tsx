import { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
  color?: 'slate-300' | 'lime-400' | 'cyan-500' | 'red-500'
}

export function Button({ color, ...props }: ButtonProps) {
  const { value, type, children, className } = props
  const standartClasses = "group flex w-full items-center justify-center rounded-full bg-slate-800 py-4 text-center text-lg font-medium outline-none ring ring-transparent focus-within:data-[color=cyan-500]:ring-cyan-500 focus-within:data-[color=lime-400]:ring-lime-400 focus-within:data-[color=red-500]:ring-red-500 focus-within:data-[color=slate-300]:ring-slate-300"
  const classnames = className ? standartClasses.concat(` ${className}`) : standartClasses

  return (
    <button
      {...props}
      type={!type ? 'button' : type}
      data-color={color}
      className={classnames}
    >
      {children ? (
        children
      ) : (
        <span
          data-color={color}
          className="group-hover:underline data-[color=cyan-500]:text-cyan-500 data-[color=lime-400]:text-lime-400 data-[color=red-500]:text-red-500 data-[color=slate-300]:text-slate-300"
        >
          {value}
        </span>
      )}
    </button>
  )
}
