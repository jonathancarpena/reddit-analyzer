import { useEffect, useState } from 'react'

// Next
import Head from 'next/head'

// Context
import { useDarkMode } from '../../context/DarkMode'

// Utils
import axios from 'axios'
import moment from 'moment'
import { fleschFormula, calcFrequency, unix, textAnalysis } from '../../lib/utils'

// Components
import Layout from '../../components/Layout'
import Loading from '../../components/Layout'
import Scores from '../../components/User/Scores'
import TextAnalysis from '../../components/User/TextAnalysis'
import Slider from '../../components/User/Slider'
import Charts from '../../components/User/Charts'
import BestAndWorst from '../../components/User/BestAndWorst'

export async function getServerSideProps(context) {
    const { query: { search } } = context
    const limit = 1000
    let error = false
    let hydrated = false
    let recentActivity = null
    let activity = {
        comments: [],
        submissions: []
    }
    let bestAndWorst = {
        bestComment: -Infinity,
        bestSubmission: -Infinity,
        worstComment: Infinity,
        worstSubmission: Infinity
    }
    let scores = {
        kindness: 0,
        upVoteRatio: 0,
        readability: 0

    }
    let frequency = {
        words: [],
        submissions: []
    }

    let total_Kindness = {
        neutral: 0,
        positive: 0
    }
    let total_Sentences = []
    let total_WordsUsed = []
    let total_Submissions = []
    let total_UpVoteRatios = []



    // Comments, Submissions, & Overview
    async function fetchOverview() {
        try {
            const res = await axios(`https://www.reddit.com/user/${search}/about.json`)
            return res.data.data
        } catch (errors) {
            return null

        }
    }
    async function fetchComments() {
        const baseUrl = `https://www.reddit.com/user/${search}/comments.json?limit=100&raw_json=1`

        const tempArr = []
        // Base Case
        // Case 1: No More Afters
        // Case 2: Temp is at >=1000

        async function helper(after) {
            const query = after ? `${baseUrl}&after=${after}` : baseUrl
            const response = await axios.get(query)
            const data = response.data.data.children
            const moreComments = response.data.data.after
            tempArr.push(...data)

            if (moreComments && tempArr.length <= limit) {
                return await helper(moreComments)
            } else {
                return data
            }
        }
        await helper()
        return tempArr
    }
    async function fetchSubmitted() {
        const baseUrl = `https://www.reddit.com/user/${search}/submitted.json?limit=100&raw_json=1`
        const tempArr = []
        // Base Case
        // Case 1: No More Afters
        // Case 2: Temp is at >=1000

        async function helper(after) {
            const query = after ? `${baseUrl}&after=${after}` : baseUrl
            const response = await axios.get(query)
            const data = response.data.data.children
            const moreSubmissions = response.data.data.after
            tempArr.push(...data)

            if (moreSubmissions && tempArr.length <= limit) {
                return await helper(moreSubmissions)
            } else {
                return data
            }
        }
        await helper()
        return tempArr
    }
    const overview = await fetchOverview()
    if (overview) {
        activity['comments'] = await fetchComments()
        activity['submissions'] = await fetchSubmitted()
    }

    // Latest Post
    let commentLastPost = null
    let submissionLastPost = null
    if (activity.comments.length > 0) {
        commentLastPost = moment(unix(activity.comments[0].data.created_utc))
    }
    if (activity.submissions.length > 0) {
        submissionLastPost = moment(unix(activity.submissions[0].data.created_utc))
    }


    if (commentLastPost && commentLastPost.isAfter(submissionLastPost)) {
        recentActivity = commentLastPost.fromNow()
    }

    if (submissionLastPost && submissionLastPost.isAfter(commentLastPost)) {
        recentActivity = submissionLastPost.fromNow()
    }




    // Analyzing Submissions
    if (activity.submissions.length > 0) {
        activity.submissions.forEach(({ data }) => {

            if (data.ups > bestAndWorst['bestSubmission']) {
                bestAndWorst['bestSubmission'] = { ...data }
            }
            if (data.score < bestAndWorst['worstSubmission']) {
                bestAndWorst['worstSubmission'] = { ...data }
            }

            const { neutralScore: titleScore, positiveScore: posTitleScore, words: titleWords } = textAnalysis(data.title)
            const { neutralScore: bodyScore, positiveScore: posBodyScore, words: bodyWords } = textAnalysis(data.selftext)
            total_Kindness = {
                neutral: total_Kindness['neutral'] += (titleScore + bodyScore),
                positive: total_Kindness['positive'] += (posTitleScore + posBodyScore)
            }
            total_WordsUsed = [...total_WordsUsed, ...titleWords, ...bodyWords]
            total_UpVoteRatios = [...total_UpVoteRatios, data.upvote_ratio]
            total_Submissions = [...total_Submissions, data.subreddit]
        })
    }

    // Analyzing Comments
    if (activity.comments.length > 0) {
        activity.comments.forEach(({ data }) => {
            if (data.ups > bestAndWorst['bestComment']) {
                bestAndWorst['bestComment'] = { ...data }
            }
            if (data.score < bestAndWorst['worstComment']) {
                bestAndWorst['worstComment'] = { ...data }
            }
            const { neutralScore, positiveScore, words } = textAnalysis(data.body)
            total_Kindness = {
                neutral: total_Kindness['neutral'] += neutralScore,
                positive: total_Kindness['positive'] += positiveScore
            }
            total_Sentences = [...total_Sentences, data.body]
            total_WordsUsed = [...total_WordsUsed, ...words]
            total_Submissions = [...total_Submissions, data.subreddit]
        })
    }


    // // Kindness Score
    scores['kindness'] = { ...total_Kindness }

    // // Flesch Formula
    scores['readability'] = fleschFormula(total_Sentences)

    // Words Used
    frequency['words'] = calcFrequency(total_WordsUsed)

    // Sub Reddit Activity
    frequency['submissions'] = calcFrequency(total_Submissions)

    // Average UpVote Ratio
    if (total_UpVoteRatios.length > 0) {
        scores['upVoteRatio'] = ((total_UpVoteRatios.reduce((accum, current) => accum + current)) / total_UpVoteRatios.length).toFixed(2)
    }



    let data = {
        submissions: [...activity['submissions']],
        comments: [...activity['comments']],
    }

    hydrated = true

    return {
        props: {
            username: search,
            overview,
            scores,
            recentActivity,
            bestAndWorst,
            frequency,
            data,
            error,
            hydrated,
        }
    }
}


function UserOverview({ overview, username, submissions, comments, recentActivity }) {
    const darkMode = useDarkMode()
    return (
        <div data-testid="user-overview" className='tracking-tight pb-10 border-b-2 flex flex-col items-center justify-center space-y-5'>
            <h1 className={`${darkMode ? ' text-secondary-100' : ' text-black'} flex flex-col items-center text-3xl  lg:flex-row lg:space-x-2  lg:text-4xl`}>
                <span>Overview for</span>
                <a
                    href={`https://www.reddit.com/user/${username}`}
                    target="_blank" rel="noopener noreferrer"
                    className={`${darkMode ? 'hover:bg-gray-900 active:bg-gray-900' : 'hover:bg-secondary-300 active:bg-secondary-300'} tracking-tight underline underline-offset-8 hover:no-underline  transition-colors ease-in-out duration-200 p-2 rounded-full text-2xl md:text-3xl lg:text-4xl`}>
                    u/{username}
                </a>
            </h1>


            <div className='flex flex-col space-y-2 items-center'>
                {/* Joined */}
                <h2 className='text-sub text-lg md:text-xl'>
                    Joined Reddit: <span className='hidden md:inline'>{moment(unix(overview.created_utc)).fromNow()} - </span> {moment(unix(overview.created_utc)).format('MMMM DD, YYYY')}
                </h2>


                {(submissions.length > 0 || comments.length > 0) &&

                    <h2 className='text-sub'>
                        Last Activity: <span>{recentActivity}</span>
                    </h2>
                }

            </div>

            <p className='text-sub text-xs text-center md:text-base'>
                *Data is available from 1000 comments and 1000 submissions ago (Reddit API limitations)
            </p>
        </div>
    )
}

function UserAnalysis({ overview, comments, submissions, scores, bestAndWorst, frequency }) {
    const darkMode = useDarkMode()

    return (

        <div data-testid="user-analysis" className={`${darkMode ? 'text-secondary-100' : 'text-black'}  flex flex-col`}>
            <Scores
                commentsKarma={overview.comment_karma}
                submissionsKarma={overview.link_karma}
                numOfComments={comments.length}
                numOfSubmissions={submissions.length}
                upVoteRatio={scores.upVoteRatio}
            />

            <TextAnalysis kindness={scores.kindness} readability={scores.readability} />

            <>
                <Slider list={frequency['submissions']} type={'subreddits'} />
                <Slider list={frequency['words']} type={'words'} />
            </>

            <>
                <Charts data={comments} type={"comments"} color1={"#7193FF"} color2={"#FFDE70"} />
                <Charts data={submissions} type={"submissions"} color1={"#ff4500"} color2={"#32c7fc"} />
            </>


            <BestAndWorst
                comments={comments.length > 0}
                bestComment={bestAndWorst['bestComment']}
                worstComment={bestAndWorst['worstComment']}
                submissions={submissions.length > 0}
                bestSubmission={bestAndWorst['bestSubmission']}
                worstSubmission={bestAndWorst['worstSubmission']}
            />
        </div>
    )
}

function UserSearch({ username, overview, error, scores, bestAndWorst, frequency, data, recentActivity, hydrated }) {
    const darkMode = useDarkMode()
    const [domLoaded, setDomLoaded] = useState(false)
    useEffect(() => {
        setDomLoaded(true)
    }, [])


    return (
        <Layout>
            <Head>
                <title>{`Overview for u/${username} - Reddit Analyzer`}</title>
                <meta name="description" content={`Overview for u/${username} - Reddit Analyzer`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {domLoaded

                ? <>
                    {overview
                        ? <>
                            <main data-testid="mainSection" id="results" className='pt-5 md:py-8 md:px-16 lg:py-16 lg:px-32 mx-auto min-h-[70vh] max-w-[1700px]'>
                                <div className={`${darkMode ? 'bg-black text-secondary-100' : 'bg-secondary-100 text-black'}   py-10 px-5 md:py-14 md:px-10 lg:p-20   md:rounded-xl min-h-[67.5vh] md:min-h-[65vh]`}>
                                    <div className='flex flex-col  transition-all duration-150'>
                                        {/* Overview */}
                                        <UserOverview
                                            overview={overview}
                                            username={username}
                                            submissions={data.submissions}
                                            comments={data.comments}
                                            recentActivity={recentActivity}
                                        />

                                        {/* Analysis */}
                                        {(data.submissions.length > 0 || data.comments.length > 0)
                                            ? <>
                                                <UserAnalysis
                                                    overview={overview}
                                                    username={username}
                                                    submissions={data.submissions}
                                                    comments={data.comments}
                                                    scores={scores}
                                                    frequency={frequency}
                                                    bestAndWorst={bestAndWorst}
                                                    recentActivity={recentActivity}
                                                />
                                            </>
                                            : <h1 className='h-[35vh]    text-sub text-2xl flex justify-center items-center'>
                                                Dust.
                                            </h1>
                                        }




                                    </div>
                                </div>
                            </main>

                        </>
                        : <main data-testid="mainSection" className='flex justify-center items-center min-h-[70vh] '>
                            <h1 className='text-5xl text-sub'>DUST</h1>
                        </main>
                    }
                </>
                : <Loading />

            }


        </Layout>

    )
}

export default UserSearch