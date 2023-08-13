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
	radioId?: string;
	rows?: number;
	css?: string;
	labelCss?: string;
	labelName?: string;
	radioDisabled?: boolean;
	[key: string]: any;
}

export default function Input({
	type,
	name,
	placeholder,
	onChange,
	value,
	radioId,
	rows,
	css,
	labelCss,
	labelName,
	radioDisabled,
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
						'font-light placeholder:text-[#bababa] w-full bg-[#101010] focus:ring-0 focus:border-palettered'
					)}
					value={value ? value : ''}
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
						'font-light placeholder:text-[#bababa] w-full bg-[#101010] focus:ring-0 focus:border-palettered'
					)}
					value={value ? value : ''}
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
						'font-light placeholder:text-[#bababa] w-full bg-[#101010] focus:ring-0 focus:border-palettered'
					)}
					value={value ? value : ''}
					{...rest}
				/>
			) : null}
			{type === 'radio' ? (
				<label>
					<input
						type='radio'
						id={radioId}
						name={name}
						value={value}
						disabled={radioDisabled}
						className={cls(css ? css : '', 'hidden peer')}
						{...rest}
					/>
					<div
						className={cls(
							labelCss ? labelCss : '',
							'peer-checked:text-palettered text-[#bababa]'
						)}
					>
						{labelName}
					</div>
				</label>
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
						'font-light placeholder:text-[#bababa] w-full block bg-[#101010] resize-none focus:ring-0 focus:border-palettered'
					)}
					{...rest}
				/>
			) : null}
		</>
	);
}
