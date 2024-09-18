import Circles from './circles';

export default function LoaidngIndicator() {
  return (
    <div className="fixed top-0 w-screen h-screen opacity-60 z-[1001] flex justify-center items-center bg-black">
      <div className="animate-spin-middle contrast-50 absolute w-[100px] aspect-square">
        <Circles
          liMotion={{
            css: 'w-[calc(16px+100%)] border-[#eaeaea] border-1',
          }}
        />
      </div>
    </div>
  );
}
