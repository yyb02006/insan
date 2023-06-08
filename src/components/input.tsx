import { cls } from '@/libs/client/utils';

interface InputProps {
	type: 'text' | 'number' | 'email' | 'textarea' | 'radio';
	name: string;
	placeholder?: string;
	onChange?:
		| ((
				e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
		  ) => void)
		| ((e: React.SyntheticEvent<HTMLInputElement>) => void);
	value?: string | undefined;
	rows?: number;
	css?: string;
	[key: string]: any;
}

export default function Input({
	type,
	name,
	placeholder,
	onChange,
	value,
	rows,
	css,
	...rest
}: InputProps) {
	return (
		<>
			{type === 'text' ? (
				<input
					onChange={onChange}
					name={name}
					placeholder={placeholder}
					type='text'
					spellCheck='false'
					className={cls(
						css ? css : '',
						'font-light placeholder:text-[#eaeaea] w-full bg-[#101010] focus:ring-0 focus:border-palettered'
					)}
					{...rest}
				/>
			) : null}
			{type === 'number' ? (
				<input
					onChange={onChange}
					name={name}
					placeholder={placeholder}
					type='text'
					spellCheck='false'
					className={cls(
						css ? css : '',
						'font-light placeholder:text-[#eaeaea] w-full bg-[#101010] focus:ring-0 focus:border-palettered'
					)}
					{...rest}
				/>
			) : null}
			{type === 'email' ? (
				<input
					onChange={onChange}
					name={name}
					placeholder={placeholder}
					type='text'
					spellCheck='false'
					className={cls(
						css ? css : '',
						'font-light placeholder:text-[#eaeaea] w-full bg-[#101010] focus:ring-0 focus:border-palettered'
					)}
					{...rest}
				/>
			) : null}
			{type === 'textarea' ? (
				<textarea
					onChange={
						onChange as (
							e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
						) => void
					}
					name={name}
					placeholder={placeholder}
					rows={rows}
					spellCheck='false'
					className={cls(
						css ? css : '',
						'font-light placeholder:text-[#eaeaea] w-full block bg-[#101010] resize-none focus:ring-0 focus:border-palettered'
					)}
					{...rest}
				/>
			) : null}
			{type === 'radio' ? (
				<input
					type='radio'
					name={name}
					value={value}
					className={cls(css ? css : '')}
					{...rest}
				/>
			) : null}
		</>
	);
}
