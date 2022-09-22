
// Icons
import { ImFire } from 'react-icons/im'
import { FaRocket } from 'react-icons/fa'

function Loading() {
    return (
        <div className='flex flex-col justify-center items-center min-h-[70vh] '>
            <h1 className='text-xl text-sub mb-5'>
                Analyzing...
            </h1>
            <div className=' p-10 relative overflow-hidden '>
                <div className='animate-move border-r-2 border-r-sub h-[100px] absolute right-[3rem] -top-[6rem] rotate-45'></div>
                <div className='animate-move  animation-delay-500 border-r-2 border-r-sub h-[100px] absolute -right-[3rem] top-[0rem] rotate-45'></div>
                <div className='animate-move  border-r-2 border-r-sub h-[100px] absolute right-[2rem] -top-[10rem] rotate-45'></div>
                <div className='animate-move animation-delay-500 border-r-2 border-r-sub h-[100px] absolute -right-[7rem] -top-[1.5rem] rotate-45'></div>

                {/* Rocket */}
                <div className='relative animate-wiggle'>
                    <FaRocket className='text-[10rem] text-sub ' />
                    <ImFire className=' animate-pulse -rotate-[135deg] text-[4rem] text-sub absolute top-[6.4rem] -left-2' />
                </div>
            </div>
        </div>
    )
}

export default Loading