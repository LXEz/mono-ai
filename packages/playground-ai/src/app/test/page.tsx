import Copy from '@/assets/icon-copy.svg';
import DocSummary from '@/assets/icon-summary.svg';
export default function TestPage() {
  return (
    <>
      <div className=" h-full w-full justify-center items-center flex bg-white">
        <DocSummary className="text-[#8e54e9]" />
        <span className="text-black w-[260px] h-[24px] block">Doc Summary</span>
      </div>
      <div className="h-full w-full justify-center items-center flex bg-white">
        <Copy />
      </div>
      <ul>
        <li>&#127482;&#127480; 英文</li>
        <li>&#127470;&#127475; 印地语</li>
        <li>&#127465;&#127466; 德语</li>
        <li>&#127464;&#127475; 中文</li>
        <li>&#127471;&#127477; 日语</li>
        <li>&#127472;&#127479; 韩语</li>
      </ul>
      <span>
        <span>&#127482;&#127480;</span>
        <span> 英文</span>
      </span>
    </>
  );
}
