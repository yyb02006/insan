import Circles from '@/components/circles';
import DoubleQuotation from '@/components/doubleQuotaition';
import Layout from '@/components/layout';
import Image from 'next/image';

const HeaderSection = () => {
	return (
		<section className='relative h-screen flex flex-col items-center justify-center leading-none font-GmarketSans font-bold text-[7rem]'>
			<div className='absolute top-[50%] translate-y-[-50%] px-6 w-full max-w-[716px] aspect-square'>
				<Image
					alt='face'
					width={716}
					height={716}
					src='/images/face.png'
					className='absolute'
				/>
				<Circles />
			</div>
			<p className='relative flex justify-start break-keep w-[73%]'>
				선 좀 넘는 디렉터,
			</p>
			<div className='relative border-t w-full'></div>
			<p className='relative flex mt-5 justify-end w-[73%]'>여인산입니다.</p>
		</section>
	);
};

const ContentsSection = () => {
	return (
		<section className='h-[450vh] px-20'>
			<div className='h-[100vh] px-24 flex items-center'>
				<div>
					<DoubleQuotation globalCss='font-GmarketSans font-bold text-[7rem]'>
						저는{' '}
						<span style={{ WebkitTextStroke: 0 }} className='text-[#eaeaea]'>
							이런 일
						</span>
						을 합니다
					</DoubleQuotation>
				</div>
			</div>
			<ul className='px-44 text-[5.125rem] text-[#eaeaea] leading-tight font-SCoreDream  font-bold'>
				<li className='flex justify-end w-full'>
					새로운 아이디어
					<span className='font-thin text-[#bababa]'>와</span>
				</li>
				<li className='flex justify-start w-full'>
					창의적인 시각
					<span className='font-thin text-[#bababa]'>을 바탕으로</span>
				</li>
				<li className='flex justify-end w-full'>
					다양한 스타일
					<span className='font-thin text-[#bababa]'>과 테마,</span>
				</li>
				<li className='flex justify-start w-full'>
					니즈에 맞는 영상
					<span className='font-thin text-[#bababa]'>을 제작합니다.</span>
				</li>
			</ul>
			<div className='w-full py-20 aspect-video overflow-hidden'>
				<Image
					src='/images/field.png'
					alt='fieldPicture'
					width={1600}
					height={900}
					className='w-full '
				/>
			</div>
			<div>also Product Designer, Drone pilot</div>
			<div className='px-24'>
				<DoubleQuotation globalCss='font-GmarketSans font-bold text-[7rem]'>
					저는 이런{' '}
					<span style={{ WebkitTextStroke: 0 }} className='text-[#eaeaea]'>
						디렉터{' '}
					</span>
					입니다
				</DoubleQuotation>
			</div>
		</section>
	);
};

export default function About() {
	return (
		<Layout seoTitle='About' nav={{ isShort: true }}>
			<HeaderSection></HeaderSection>
			<ContentsSection></ContentsSection>
		</Layout>
	);
}
