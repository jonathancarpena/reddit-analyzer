import { useState } from 'react'

// Context
import { useDarkMode } from '../../context/DarkMode'

// Components
import ReactSlider from 'react-slider'

let limit = 75
function Slider({ list, type }) {
    const [slicedList, setSlicedList] = useState([list[0]])
    const darkMode = useDarkMode()
    if (list.length < 75) {
        limit = list.length
    }

    function handleSliderChange(value) {
        const percent = (value / 100)
        let lastIndex = Math.round(limit * percent)
        let slicedArray = [...list.slice(0, lastIndex)]

        if (value === 1) {
            slicedArray = [list[0]]
        }
        setSlicedList([...slicedArray])
    }

    return (
        <div className=' py-10 border-b-2'>
            <div className='mb-20'>
                <h3 className='text-3xl   text-center'>
                    {type === 'subreddits' ? 'Top Subreddits' : 'Most frequently used words'}
                </h3>

                <div className='w-[60%] lg:w-[40%] mx-auto block mt-6'>
                    <ReactSlider
                        defaultValue={1}
                        minDistance={1}
                        min={1}
                        onChange={handleSliderChange}
                        renderThumb={(props, state) =>
                            <div {...props}
                                className={`
                                bg-white border-2 p-3 relative select-none  -top-[7px] w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] text-transparent rounded-full
                        cursor-pointer active:scale-125 transition-transform 
                         `} >
                                .
                            </div>}
                        renderTrack={(props, state) =>
                            <div {...props}
                                className={`
                        bg-secondary-500 h-[10px] md:h-[15px] lg:h-[20px]  text-transparent rounded-full
                        cursor-pointer 
                         `} >
                                .
                            </div>}
                    />
                </div>
            </div>


            <ul className='flex flex-wrap justify-center w-[95%] mx-auto'>
                {slicedList.map((item, idx) => (
                    <li key={item.word}>
                        <a
                            href={`https://www.reddit.com/r/${item.word}`}
                            target="_blank" rel="noopener noreferrer"
                            className={`
                            flex flex-col space-y-2 mx-1 mb-2.5 lg:mx-2.5 lg:mb-5
                            ${idx === 0 ? 'bg-primary-500 ring-primary-500 lg:font-semibold text-white' : `${darkMode ? 'bg-gray-900 ring-black text-secondary-100' : 'bg-white ring-secondary-300 text-black'} `}
                            ring-2   text-sm lg:text-base
                             p-2  lg:p-3 rounded-md drop-shadow-md
                             transition-all ease-in-out duration-150
                             hover:scale-110 hover:drop-shadow-xl 
                             
                             `}>
                            {type === "subreddits"
                                ? <>
                                    <span>/r/{item.word}</span>
                                    <span>{item.value} posts ({item.percent}%)</span>
                                </>
                                : <>
                                    <span className={`${idx === 0 ? 'lg:font-semibold' : ''}`}>{item.word}</span>
                                    <span>{item.value} times</span>
                                </>

                            }

                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Slider