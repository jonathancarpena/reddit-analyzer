import { useDarkMode } from "../../context/DarkMode"

function Figure({ title, value }) {
    const darkMode = useDarkMode()
    return (
        <div className='flex flex-col items-center'>
            <div className={`${darkMode ? 'bg-gray-900 text-secondary-100' : 'bg-white text-black'}  flex items-center justify-center relative top-5 h-[100px] w-[100px] md:h-[120px] md:w-[120px] border-4 border-analogous-500 rounded-full mx-auto z-0`}>
                <span className={`${value > 1000000 ? 'text-xl' : 'text-2xl'} font-bold`}>{value}</span>
            </div>
            <span className='uppercase inline-block mx-auto bg-analogous-500 text-white font-semibold text-sm md:text-base px-4 py-2 rounded-full z-10'>
                {title}
            </span>
        </div>
    )
}
function Scores({ numOfComments, numOfSubmissions, commentsKarma, submissionsKarma, upVoteRatio }) {
    return (
        <>
            <div className='flex flex-col md:flex-row justify-evenly items-center flex-wrap pb-10 pt-2.5 border-b-2'>
                <Figure title='Comments' value={numOfComments} />
                <Figure title='Submissions' value={numOfSubmissions} />
                <Figure title='Avg. Up Vote Ratio' value={upVoteRatio} />
                <Figure title='Comments/Karma' value={commentsKarma} />
                <Figure title='Submissions/Karma' value={submissionsKarma} />
            </div>
        </>

    )
}

export default Scores