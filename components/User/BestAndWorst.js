
// Utils
import moment from 'moment'
import { useDarkMode } from '../../context/DarkMode';
import { unix } from '../../lib/utils'


function BestAndWorst({ comments, bestComment, worstComment, submissions, bestSubmission, worstSubmission }) {
    const darkMode = useDarkMode()
    function addEllipsis(text) {
        if (text.length > 160) {
            return text.substring(0, 160) + '...';
        }
        return text
    }

    return (
        <div className='pt-10 pb-20 md:pb-10 flex flex-col w-full lg:w-[95%] mx-auto'>

            {comments &&
                <div className={` grid gap-10 md:grid-cols-2 md:gap-5 ${submissions ? `${darkMode ? 'border-b-gray-900' : 'border-b-secondary-600'} pb-10 border-b-2 ` : ''} `}>
                    {/* Best Comment */}
                    <div>
                        <span className='block mb-5 text-3xl text-center'>
                            Best Comment
                        </span>
                        <div className='flex flex-col space-y-3'>
                            <p className='flex flex-col space-y-1 xl:items-center xl:space-y-0 xl:flex-row xl:space-x-2'>
                                <a href={`${bestComment.link_permalink}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className='underline underline-offset-2 md:text-lg'>
                                    r/{bestComment.subreddit}
                                </a>
                                <span className='text-sm md:text-base text-sub'>{bestComment.ups} votes</span>
                                <span className='text-sm md:text-base text-sub'>Posted: {moment(unix(bestComment.created)).fromNow()}</span>
                            </p>
                            <p className={`${darkMode ? 'bg-dark border-gray-900' : 'bg-secondary-300 border-secondary-400'} break-all  min-h-[100px] max-h-[100px] text-sm md:text-base p-2 xl:p-3  rounded-sm  border-2  overflow-clip w-[90vw] md:w-full`}>
                                {`"${addEllipsis(bestComment.body)}"`}
                            </p>

                        </div>

                    </div>

                    {/* Worst Comment */}
                    <div className=''>
                        <span className='block mb-5 text-3xl text-center'>
                            Worst Comment
                        </span>
                        <div className='flex flex-col space-y-3'>
                            <p className='flex flex-col space-y-1 xl:items-center xl:space-y-0 xl:flex-row xl:space-x-2'>
                                <a href={`${worstComment.link_permalink}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className='underline underline-offset-2 md:text-lg'>
                                    r/{worstComment.subreddit}
                                </a>
                                <span className='text-sm md:text-base text-sub'>{worstComment.ups} votes</span>
                                <span className='text-sm md:text-base text-sub'>Posted {moment(unix(worstComment.created)).fromNow()}</span>
                            </p>
                            <p className={`${darkMode ? 'bg-dark border-gray-900' : 'bg-secondary-300 border-secondary-400'} break-all  min-h-[100px] max-h-[100px] text-sm md:text-base p-2 xl:p-3  rounded-sm  border-2  overflow-clip w-[90vw] md:w-full`}>
                                {`"${addEllipsis(worstComment.body)}"`}
                            </p>
                        </div>
                    </div>
                </div>
            }

            {submissions &&
                <div className={`grid gap-10 md:grid-cols-2 md:gap-5 ${comments ? 'pt-10' : ''}`}>
                    {/* Best Submission */}
                    <div className=''>
                        <span className='block mb-5 text-3xl text-center'>
                            Best Submission
                        </span>
                        <div className='flex flex-col space-y-3'>
                            <p className=' flex flex-col space-y-1 xl:items-center xl:space-y-0 xl:flex-row xl:space-x-2'>
                                <a href={`${bestSubmission.url}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className='underline underline-offset-2 md:text-lg'>
                                    r/{bestSubmission.subreddit}
                                </a>
                                <span className='text-sm md:text-base text-sub'>{bestSubmission.ups} votes</span>
                                <span className='text-sm md:text-base text-sub'>Posted: {moment(unix(bestSubmission.created)).fromNow()}</span>
                            </p>
                            <p className={`${darkMode ? 'bg-dark border-gray-900' : 'bg-secondary-300 border-secondary-400'} break-all  min-h-[100px] max-h-[100px] text-sm md:text-base p-2 xl:p-3  rounded-sm  border-2  overflow-clip w-[90vw] md:w-full`}>
                                {`"${bestSubmission.selftext ? addEllipsis(bestSubmission.selftext) : addEllipsis(bestSubmission.title)}"`}
                            </p>
                        </div>
                    </div>
                    {/* Worst Submission */}
                    <div>
                        <span className='block mb-5 text-3xl text-center'>
                            Worst Submission
                        </span>
                        <div className='flex flex-col space-y-3'>
                            <p className='flex flex-col space-y-1 xl:items-center xl:space-y-0 xl:flex-row xl:space-x-2'>
                                <a href={`${worstSubmission.url}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className='underline underline-offset-2 md:text-lg'>
                                    r/{worstSubmission.subreddit}
                                </a>
                                <span className='text-sm md:text-base text-sub'>{worstSubmission.ups} votes</span>
                                <span className='text-sm md:text-base text-sub'>Posted: {moment(unix(worstSubmission.created)).fromNow()}</span>
                            </p>
                            <p className={`${darkMode ? 'bg-dark border-gray-900' : 'bg-secondary-300 border-secondary-400'} break-all  min-h-[100px] max-h-[100px] text-sm md:text-base p-2 xl:p-3  rounded-sm  border-2  overflow-clip w-[90vw] md:w-full`}>
                                {`"${worstSubmission.selftext ? addEllipsis(worstSubmission.selftext) : addEllipsis(worstSubmission.title)}"`}
                            </p>
                        </div>
                    </div>
                </div>
            }


        </div >
    )
}

export default BestAndWorst