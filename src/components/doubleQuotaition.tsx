import { cls } from '@/libs/client/utils';
import Image from 'next/image';
import { ReactNode } from 'react';

interface DoubleQuotationProps {
	children: ReactNode;
	globalCss?: string;
}

export default function DoubleQuotation({
	children,
	globalCss = 'text-[6.25rem]',
}: DoubleQuotationProps) {
	return (
		<div>
			<span
				style={{ WebkitTextStroke: '1px #eaeaea' }}
				className={cls(
					globalCss,
					'relative text-[#101010] break-keep leading-none'
				)}
			>
				<Image
					src='/images/left-double-quotation.svg'
					alt='quotation'
					width={60}
					height={36}
					className='absolute -left-12 sm:-left-24 -top-8 sm:-top-10 w-[30px] h-[18px] sm:w-[60px] sm:h-[36px]'
				/>
				{children}
				<Image
					src='/images/right-double-quotation.svg'
					alt='quotation'
					width={60}
					height={36}
					className='absolute -bottom-4 -right-12 sm:-right-24 w-[30px] h-[18px] sm:w-[60px] sm:h-[36px]'
				/>
			</span>
		</div>
	);
}
