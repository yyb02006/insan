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
		<section className='px-20'>
			<div className='h-[100vh] px-24 flex items-center'>
				<DoubleQuotation globalCss='font-GmarketSans font-bold text-[7rem]'>
					저는{' '}
					<span style={{ WebkitTextStroke: 0 }} className='text-[#eaeaea]'>
						이런 일
					</span>
					을 합니다
				</DoubleQuotation>
			</div>
			<ul className='px-44 text-[5.125rem] text-[#eaeaea] leading-tight font-SCoreDream font-bold'>
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
				<li className='flex justify-start w-full flex-nowrap'>
					니즈에 맞는 영상
					<span className='font-thin text-[#bababa]'>을 제작합니다.</span>
				</li>
			</ul>
			<div className='relative w-full py-20 aspect-video overflow-hidden'>
				<Image
					src='/images/field.png'
					alt='fieldPicture'
					width={1600}
					height={900}
					className='w-full'
				/>
				<div className='absolute z-[1] font-GmarketSans bottom-16 right-4 bg-[#eaeaea] text-[#101010] text-[4rem] font-bold px-6 py-2'>
					Camera, Director, Video Editor
				</div>
			</div>
			<div className='w-full py-16 text-5xl leading-none font-bold font-GmarketSans flex items-end pl-40'>
				also Product Designer, Drone pilot
			</div>
			<div className='h-[100vh] mt-[10vh] flex justify-end items-center px-24'>
				<DoubleQuotation globalCss='font-GmarketSans font-bold text-[7rem]'>
					저는 이런{' '}
					<span style={{ WebkitTextStroke: 0 }} className='text-[#eaeaea]'>
						디렉터{' '}
					</span>
					입니다
				</DoubleQuotation>
			</div>
			<ul className='relative w-[75%] m-auto grid lg:grid-cols-2 grid-cols-1 justify-items-center text-[15px] items-center aspect-square leading-relaxed'>
				<li className='relative xl:w-[340px] md:w-[280px] w-[220px] h-[250px] aspect-square flex flex-col justify-between'>
					<div className='absolute w-full h-full flex justify-center items-center'>
						<div className='absolute min-w-[500px] w-[40vw] aspect-square border border-[#707070] rounded-full'></div>
					</div>
					<div className='relative w-full text-[2rem] font-bold'>
						트렌디한 감각
					</div>
					<div className='relative font-extralight '>
						사람들의 마음을 살 수 있는 감성을 잃지 않으려 노력합니다. 저의
						감각은 디자인적 트렌드뿐만 아니라, 드론과 3D촬영같은 기술적 트렌드를
						반영하는 것에도 특화되어 있습니다.
					</div>
				</li>
				<li className='relative xl:w-[340px] md:w-[280px] w-[220px] h-[250px] aspect-square flex flex-col justify-between'>
					<div className='absolute w-full h-full flex justify-center items-center'>
						<div className='absolute min-w-[500px] w-[40vw] aspect-square border border-[#707070] rounded-full'></div>
					</div>
					<div className='relative text-[2rem] font-bold'>
						융통성 있는 작업과정
					</div>
					<div className='relative font-extralight'>
						여러 사람이 모여 영상컨텐츠를 만들어내는 과정은 곧 예상치 못한
						문제를 해결해내는 과정입니다. 컨텐츠가 완성될 때까지 겪게 되는 모든
						어려움에 유연하게 대처하고 팀을 이끌어나갈 수 있습니다.
					</div>
				</li>
				<li className='relative xl:w-[340px] md:w-[280px] w-[220px] h-[250px] aspect-square flex flex-col justify-between'>
					<div className='absolute w-full h-full flex justify-center items-center'>
						<div className='absolute min-w-[500px] w-[40vw] aspect-square border border-[#707070] rounded-full'></div>
					</div>
					<div className='relative text-[2rem] font-bold'>결과에 대한 집착</div>
					<div className='relative font-extralight'>
						클라이언트의 요구를 만족시키는 일은 결코 운 좋게 눈속임한 퀄리티로
						해낼 수 없습니다. 때문에 영상디자이너는 항상 결과물로 말해야한다는
						생각으로 작업에 임합니다.
					</div>
				</li>
				<li className='relative xl:w-[340px] md:w-[280px] w-[220px] h-[250px] aspect-square flex flex-col justify-between'>
					<div className='absolute w-full h-full flex justify-center items-center'>
						<div className='absolute min-w-[500px] w-[40vw] aspect-square border border-[#707070] rounded-full'></div>
					</div>
					<div className='relative text-[2rem] font-bold'>
						연구를 즐기는 스타일
					</div>
					<div className='relative font-extralight'>
						영상으로 무언가를 표현한다는 것은 저에게 직업이고 기술이기 이전에,
						꿈이자 취미입니다. 메시지를 어떻게 사람들에게 전달할 수 있을지에
						대한 고민과 연구를 지금 이 순간에도 하고 있습니다.
					</div>
				</li>
			</ul>
			<div className='relative mb-[320px] w-full h-[100vh] flex justify-center items-end'>
				<div className='absolute w-[30%] flex justify-center items-center'>
					<Circles />

					<span
						style={{ WebkitTextStroke: '1px #eaeaea' }}
						className='relative font-GmarketSans font-bold text-[10rem] text-[#101010]'
					>
						Contact
					</span>
				</div>
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
