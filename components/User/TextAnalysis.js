import { useDarkMode } from '../../context/DarkMode'

// Icons
import { GoGift } from 'react-icons/go'
import { BiGlasses } from 'react-icons/bi'

const Bar = ({ percentage }) => {
    const darkMode = useDarkMode()
    let percent = 0
    if (percentage <= 0) {
        percent = 0
    } else if (percentage > 0 && percentage <= 10) {
        percent = 10
    } else if (percentage > 10 && percentage <= 20) {
        percent = 20
    } else if (percentage > 20 && percentage <= 30) {
        percent = 30
    } else if (percentage > 30 && percentage <= 40) {
        percent = 40
    } else if (percentage > 40 && percentage <= 50) {
        percent = 50
    } else if (percentage > 50 && percentage <= 60) {
        percent = 60
    } else if (percentage > 60 && percentage <= 70) {
        percent = 70
    } else if (percentage > 70 && percentage <= 80) {
        percent = 80
    } else if (percentage > 80 && percentage <= 90) {
        percent = 90
    } else if (percentage > 90) {
        percent = 100
    }

    const widthPercentage = {
        0: 'w-0',
        10: 'w-[10%] bg-[#7193FF]',
        20: 'w-[20%] bg-[#7193FF]',
        30: 'w-[30%] bg-[#7193FF]',
        40: 'w-[40%] bg-[#7193FF]',
        50: 'w-[50%] bg-[#7193FF]',
        60: 'w-[60%] bg-primary-500',
        70: 'w-[70%] bg-primary-500',
        80: 'w-[80%] bg-primary-500',
        90: 'w-[90%] bg-primary-500',
        100: 'w-[100%] bg-primary-500',
    }
    return (
        <div className={`border-[1px] ${darkMode ? 'border-gray-900 ' : 'border-secondary-300'} w-full h-[60px]   flex rounded-xl overflow-hidden relative `}>
            <div className={`${widthPercentage[percent]} bg-primary-500 py-2 text-transparent`}>
                .
            </div>
            <span className={`${percentage >= 50 ? ' text-white' : 'text-black'}   left-[50%] -translate-x-[50%] text-xl font-bold absolute top-[50%] -translate-y-[50%] `}>
                {percentage}%
            </span>
            <div className={`${darkMode ? 'bg-gray-900 text-gray-900 ' : 'bg-secondary-300 text-secondary-100'}   flex-1`}>
                .
            </div>

        </div>
    )
}


const ReadingScore = ({ score }) => {
    const darkMode = useDarkMode()
    let difficulty = ''
    if (score < 100 && score > 89) {
        difficulty = 'Very Easy'
    } else if (score < 90 && score > 79) {
        difficulty = 'Easy'
    } else if (score < 80 && score > 69) {
        difficulty = 'Fairly Easy'
    } else if (score < 70 && score > 59) {
        difficulty = 'Standard'
    } else if (score < 60 && score > 49) {
        difficulty = 'Fairly Difficult'
    } else if (score < 50 && score > 29) {
        difficulty = 'Difficult'
    } else {
        difficulty = 'Very Difficult'
    }


    return (
        <div className={`w-full h-[60px] ${darkMode ? 'bg-gray-900 ' : 'bg-white '}  text-primary-500  font-semibold text-center flex justify-center items-center border-4 border-primary-500 rounded-xl py-2 overflow-hidden relative text-xl`}>
            {difficulty}
        </div>
    )
}
function TextAnalysis({ kindness, readability }) {
    const darkMode = useDarkMode()
    let percentage = Math.round((kindness.positive / kindness.neutral) * 100)
    if (!percentage) {
        percentage = 100
    }

    // 90-100: 5th grade reading level Very Easy
    // 80-90: 6th grade reading level Easy
    // 70-80: 7th grade reading level Fairly Easy
    // 60-70: 8th and 9th grade reading level Standard
    // 50-60: High school reading level Fairly Difficult
    // 30-50: College student reading level Difficult
    // 10-30: College graduate reading level Very Difficult
    // 10 or lower: Professional or reader with an advanced university degree


    return (
        <div className=' py-10 border-b-2'>

            <h3 className='text-center mb-10 text-3xl  '>
                English-based Text Analysis
            </h3>
            <div className='flex flex-col space-y-10 md:space-y-0 md:flex-row text-center justify-around md:justify-evenly '>
                <div className=' flex flex-col space-y-5 items-center w-full md:w-[40%]'>
                    <h3 className='text-2xl'>Kindness Meter</h3>
                    <GoGift className={`${darkMode ? ' text-secondary-100' : ' text-black'} text-[10rem] `} />
                    <p className=''>Calculated through text analysis</p>
                    <Bar darkMode={darkMode} percentage={percentage} />
                </div>
                <div className='border-l border-secondary-600 hidden md:block'></div>
                <div className='flex flex-col space-y-5 items-center w-full md:w-[40%]'>
                    <h3 className='text-2xl'>Text Readability</h3>
                    <BiGlasses className={`${darkMode ? ' text-secondary-100' : ' text-black'} text-[10rem]  `} />

                    <p className=''>Calculated with the <a href="https://readabilityformulas.com/flesch-reading-ease-readability-formula.php" target="_blank" rel="noopener noreferrer" className='underline underline-offset-1 '>Flesch Formula</a></p>
                    <ReadingScore darkMode={darkMode} score={readability} />
                </div>
            </div>
        </div>
    )
}

export default TextAnalysis