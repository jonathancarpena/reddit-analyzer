import { useEffect, useState } from 'react'

// Next
import Head from 'next/head'

// Context
import { useDarkMode } from '../../context/DarkMode'

// Utils
import axios from 'axios'
import moment from 'moment'
import { unix } from '../../lib/utils'

// Components
import Loading from '../../components/Layout'

export async function getServerSideProps(context) {

    const { query: { search } } = context
    const limit = 1000
    let error = false
    let activity = []


    // Overview, Subreddit Posts
    async function fetchOverview() {
        try {
            const res = await axios(`https://www.reddit.com/r/${search}/about.json`)
            return res.data.data
        } catch (errors) {
            error = true
        }
    }

    async function fetchPosts() {
        const baseUrl = `https://www.reddit.com/r/${search}/.json?limit=100&raw_json=1`

        const tempArr = []
        // Base Case
        // Case 1: No More Afters
        // Case 2: Temp is at >=1000

        async function helper(after) {
            const query = after ? `${baseUrl}&after=${after}` : baseUrl
            const response = await axios.get(query)
            const data = response.data.data.children
            const morePosts = response.data.data.after
            tempArr.push(...data)

            if (morePosts && tempArr.length <= limit) {
                return await helper(morePosts)
            } else {
                return data
            }
        }
        await helper()
        return tempArr
    }
    const overview = await fetchOverview()


    if (overview) {
        activity = await fetchPosts()
    }

    if (activity.length > 0) {
        activity.sort((a, b) => {
            const prev = new Date(unix(b.data.created_utc))
            const next = new Date(unix(a.data.created_utc))
            return prev - next
        })
    }



    return {
        props: {
            activity, overview
        }
    }
}

const PixelColors = {
    0: 'bg-white hover:bg-gray-200',
    25: 'bg-analogous-100 hover:bg-analogous-200',
    50: 'bg-analogous-300 hover:bg-analogous-400',
    75: 'bg-analogous-500 hover:bg-analogous-600',
    100: 'bg-analogous-700 hover:bg-analogous-800'
}

function Pixel({ percentile, score, day, hour }) {
    const [show, setShow] = useState(false)
    const [hiddenDelay, setHiddenDelay] = useState(false)
    // bg-color-100  1-25%
    // bg-color-300  26-50%
    // bg-color-500  51-75%
    // bg-color-700  76-100%

    function handleShow() {
        setShow(!show)
        if (!hiddenDelay) {
            setHiddenDelay(!hiddenDelay)
        } else {
            setTimeout(() => {
                setHiddenDelay(!hiddenDelay)
            }, 300)
        }
    }
    return (
        <div onClick={handleShow} className={`${hiddenDelay ? 'overflow-visible' : 'overflow-hidden'} cursor-pointer relative w-[25px] h-[25px]  md:w-[40px] md:h-[40px] border-2 border-secondary-400 ${PixelColors[percentile]}  -z-1 text-sm`}>

            <div className={`${show ? 'tranlate-y-0 opacity-100' : 'translate-y-[50px] opacity-0 select-none'}  transition-all ease-in-out duration-200 absolute bottom-[25px] left-[50%] -translate-x-[50%] bg-gray-700 text-white p-2.5 rounded-lg z-50 hidden md:flex flex-col space-y-2 w-max`}>
                <span># of Activity: {score}</span>
                <span>{day} @ {hour}</span>
            </div>


        </div>
    )
}

function HeatMap({ activity }) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const xAxis = ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"]
    let mean;
    let at25;
    let at75;
    let best = {
        day: '',
        score: 0,
        time: ''
    }

    function addHour(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }


    let dataSet = {}

    function generateDataSet() {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 24; j++) {
                let newHour = moment(addHour(j)).format('h:00 a')
                dataSet[days[i]] = {
                    ...dataSet[days[i]],
                    [newHour]: 0
                }
            }
        }
    }
    generateDataSet()




    function analyzeData() {
        activity.forEach(({ data }) => {
            const date = moment(unix(data.created_utc))
            const day = date.format('ddd')
            const time = date.format('h:00 a')
            dataSet[day][time] = dataSet[day][time] += (data.score + data.num_comments)
        })
    }

    function generateBestTime() {
        const dayAndTimesSet = Object.entries(dataSet)
        dayAndTimesSet.forEach((item) => {
            const day = item[0]
            const timeSet = item[1]
            const allTimes = Object.keys(item[1])
            const maxOfAllScoresByTime = Math.max(...Object.values(timeSet))
            const index = Object.values(timeSet).findIndex(num => num === maxOfAllScoresByTime)

            if (maxOfAllScoresByTime > best.score) {
                best = {
                    day: day,
                    time: allTimes[index],
                    score: maxOfAllScoresByTime
                }
            }
        })

    }
    function generatePercentiles() {
        let total = []
        const temp = Object.values(dataSet)
        temp.forEach((item) => {
            const timeScores = Object.values(item)
            total = [...total, ...timeScores]
        })
        mean = Math.round((total.reduce((accum, current) => accum + current)) / total.length)
        const twentyFive = Math.round(mean * 0.25)
        at25 = mean - twentyFive
        at75 = mean + twentyFive



        const result = Object
            .entries(dataSet)
            .map((item) => {
                let timeObj = { ...item[1] }

                Object.entries(timeObj).forEach((element) => {
                    const timeKey = element[0]
                    const score = element[1]

                    if (score > at75) {
                        timeObj[timeKey] = {
                            score: score,
                            percentile: 100,
                        }
                    } else if (score < at75 && score > mean) {
                        timeObj[timeKey] = {
                            score: score,
                            percentile: 75,
                        }
                    } else if (score < mean && score > at25) {
                        timeObj[timeKey] = {
                            score: score,
                            percentile: 50,
                        }
                    } else if (score < at25 && score > 0) {
                        timeObj[timeKey] = {
                            score: score,
                            percentile: 25,
                        }
                    } else {
                        timeObj[timeKey] = {
                            score: score,
                            percentile: 0,
                        }
                    }
                })


                return Object.entries(timeObj)

            })

        return result

    }

    function generatePhoneData(results) {
        const array = []
        for (let i = 0; i < results.length * 2; i++) {
            if (i < 7) {
                let tempDayArray = []
                let dayArray = results[i]
                for (let j = 0; j < 12; j++) {
                    let timeSlot = dayArray[j]
                    let time = timeSlot[0]
                    let scores = timeSlot[1]
                    tempDayArray.push([time, scores])
                }
                array.push(tempDayArray)
            } else {
                let index = i - 7
                let tempDayArray = []
                let dayArray = results[index]
                for (let j = 12; j < 24; j++) {
                    let timeSlot = dayArray[j]
                    let time = timeSlot[0]
                    let scores = timeSlot[1]
                    tempDayArray.push([time, scores])
                }
                array.push(tempDayArray)
            }
        }
        return array

    }
    analyzeData()
    generateBestTime()
    const results = generatePercentiles()
    const phoneResults = generatePhoneData(results)
    return (
        <div className='flex flex-col space-y-10'>

            {/* Current Time */}
            <h1 className='text-xl md:text-2xl  self-center underline underline-offset-2 select-none'>
                Time: {moment(Date.now()).format('ddd, h:mm A')}
            </h1>

            {/* Desktop */}
            {/* Container: Heat Map & Legend */}
            <div className='xl:block hidden '>

                {/* Heat Map */}
                <div className=''>
                    <div className='flex '>
                        {/* Y Axis */}
                        <ul className='grid-rows-[repeat(6,_1fr)] mr-2 select-none'>
                            {days.map((item) => (
                                <li key={item} className='h-[40px] text-lg    flex items-center'>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Pixels */}
                        <div className='grid grid-cols-[repeat(24,_1fr)] grid-rows-[repeat(7,_1fr)] '>
                            {results[0].map((item, idx) => (
                                <Pixel key={`sun-pixel-${idx}`} day={days[0]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                            {results[1].map((item, idx) => (
                                <Pixel key={`mon-pixel-${idx}`} day={days[1]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                            {results[2].map((item, idx) => (
                                <Pixel key={`tue-pixel-${idx}`} day={days[2]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                            {results[3].map((item, idx) => (
                                <Pixel key={`wed-pixel-${idx}`} day={days[3]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                            {results[4].map((item, idx) => (
                                <Pixel key={`thu-pixel-${idx}`} day={days[4]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                            {results[5].map((item, idx) => (
                                <Pixel key={`fri-pixel-${idx}`} day={days[5]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                            {results[6].map((item, idx) => (
                                <Pixel key={`sat-pixel-${idx}`} day={days[6]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                            ))}
                        </div>


                        {/* Legend */}
                        <div className='select-none rounded-md text-sm w-max ml-4 bg-secondary-300  border-2 border-secondary-400 p-5 text-gray-900 flex flex-col justify-evenly'>
                            <div className='flex space-x-2 items-center'>
                                <div className='border-2 bg-white min-w-[40px] h-[40px]'></div>
                                <span>0</span>
                            </div>
                            <div className='flex space-x-2 items-center'>
                                <div className={`${PixelColors[25]} min-w-[40px] h-[40px] border-2`}></div>
                                <span>{`<${at25}`}</span>
                            </div>
                            <div className='flex space-x-2 items-center'>
                                <div className={`${PixelColors[50]} min-w-[40px] h-[40px] border-2`}></div>
                                <span>{`${at25}-${mean}`}</span>
                            </div>
                            <div className='flex space-x-2 items-center'>
                                <div className={`${PixelColors[75]} min-w-[40px] h-[40px] border-2`}></div>
                                <span>{`${mean + 1}-${at75}`}</span>
                            </div>
                            <div className='flex space-x-2 items-center'>
                                <div className={`${PixelColors[100]} min-w-[40px] h-[40px] border-2`}></div>
                                <span>{`>${at75}`}</span>
                            </div>
                        </div>
                    </div>

                    {/* X Axis */}
                    <div className='select-none flex ml-[48px]'>
                        {xAxis.map((time, idx) => (
                            <span key={`${time}-${idx}`} className='w-[40px] flex justify-center text-lg   pt-3'>{time}</span>
                        ))}
                    </div>

                </div>

            </div>

            {/* Phone */}
            {/* Container: Heat Map & Legend */}
            <div className='xl:hidden  flex flex-col'>
                <div className='flex flex-col items-center space-y-10'>

                    {/* 1/2 Heat Map */}
                    <div className='flex flex-col'>
                        <div className='flex '>
                            {/* Y Axis */}
                            <ul className='grid-rows-[repeat(6,_1fr)] mr-2'>
                                {days.map((item) => (
                                    <li key={item} className='h-[25px] md:h-[40px] text-xs md:text-sm lg:text-base    flex items-center'>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Pixels */}
                            <div className='   grid grid-cols-[repeat(12,_1fr)] grid-rows-[repeat(7,_1fr)] '>
                                {phoneResults[0].map((item, idx) => (
                                    <Pixel key={`sun-phone-pixel-${idx}`} day={days[0]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[1].map((item, idx) => (
                                    <Pixel key={`mon-phone-pixel-${idx}`} day={days[1]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[2].map((item, idx) => (
                                    <Pixel key={`tue-phone-pixel-${idx}`} day={days[2]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[3].map((item, idx) => (
                                    <Pixel key={`wed-phone-pixel-${idx}`} day={days[3]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[4].map((item, idx) => (
                                    <Pixel key={`thu-phone-pixel-${idx}`} day={days[4]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[5].map((item, idx) => (
                                    <Pixel key={`fri-phone-pixel-${idx}`} day={days[5]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[6].map((item, idx) => (
                                    <Pixel key={`sat-phone-pixel-${idx}`} day={days[6]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                            </div>

                        </div>
                        {/* X Axis */}
                        <div className='flex w-[300px] md:w-[485px] ml-[34px] lg:ml-[42px] justify-evenly'>
                            {xAxis.slice(0, 12).map((time, idx) => (
                                <span key={`${time}-${idx}`} className='w-[25px] md:w-[40px] flex justify-center text-xs md:text-sm lg:text-base   pt-3'>{time}</span>
                            ))}
                        </div>
                    </div>

                    {/* 2/2 Heat Map */}
                    <div className='flex flex-col'>
                        <div className='flex'>
                            {/* Y Axis */}
                            <ul className='grid-rows-[repeat(6,_1fr)] mr-2'>
                                {days.map((item) => (
                                    <li key={item} className='h-[25px] md:h-[40px] text-xs md:text-sm lg:text-base    flex items-center'>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Pixels */}
                            <div className='   grid grid-cols-[repeat(12,_1fr)] grid-rows-[repeat(7,_1fr)] '>
                                {phoneResults[7].map((item, idx) => (
                                    <Pixel key={`sun-phone-pixel-${idx}`} day={days[0]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[8].map((item, idx) => (
                                    <Pixel key={`mon-phone-pixel-${idx}`} day={days[1]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[9].map((item, idx) => (
                                    <Pixel key={`tue-phone-pixel-${idx}`} day={days[2]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[10].map((item, idx) => (
                                    <Pixel key={`wed-phone-pixel-${idx}`} day={days[3]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[11].map((item, idx) => (
                                    <Pixel key={`thu-phone-pixel-${idx}`} day={days[4]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[12].map((item, idx) => (
                                    <Pixel key={`fri-phone-pixel-${idx}`} day={days[5]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                                {phoneResults[13].map((item, idx) => (
                                    <Pixel key={`sat-phone-pixel-${idx}`} day={days[6]} hour={item[0]} score={item[1].score} percentile={item[1].percentile} />
                                ))}
                            </div>

                        </div>
                        {/* X Axis */}
                        <div className='flex w-[300px] md:w-[485px] ml-[34px] lg:ml-[42px] justify-evenly'>
                            {xAxis.slice(12, 24).map((time, idx) => (
                                <span key={`${time}-${idx}`} className='w-[25px] md:w-[40px]  flex justify-center text-xs md:text-sm lg:text-lg   pt-3'>{time}</span>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className='w-max  bg-secondary-300  border-2 border-secondary-400  rounded-md p-5   flex flex-col justify-evenly text-xs md:text-sm lg:text-base'>
                        <div className='flex space-x-2 items-center'>
                            <div className='border-2 bg-white w-[25px] h-[25px] md:w-[40px] md:h-[40px]'></div>
                            <span>0</span>
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <div className={`${PixelColors[25]} w-[25px] h-[25px] md:w-[40px] md:h-[40px] border-2`}></div>
                            <span>{`<${at25}`}</span>
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <div className={`${PixelColors[50]} w-[25px] h-[25px] md:w-[40px] md:h-[40px] border-2`}></div>
                            <span>{`${at25}-${mean}`}</span>
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <div className={`${PixelColors[75]} w-[25px] h-[25px] md:w-[40px] md:h-[40px] border-2`}></div>
                            <span>{`${mean + 1}-${at75}`}</span>
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <div className={`${PixelColors[100]} w-[25px] h-[25px] md:w-[40px] md:h-[40px] border-2`}></div>
                            <span>{`>${at75}`}</span>
                        </div>
                    </div>
                </div>


            </div>


            {/* Best Timt */}
            <h1 className='text-xl md:text-2xl   text-center'>
                Best time is on {best.day} at {best.time}
            </h1>


        </div>
    )
}
function SubredditOverview({ overview, activity }) {
    const darkMode = useDarkMode()
    const dateBegin = moment(unix(activity[activity.length - 1].data.created_utc)).format('dddd MMMM DD, YYYY')
    const dateEnds = moment(unix(activity[0].data.created_utc)).format('dddd MMMM DD, YYYY')
    return (
        <div className='tracking-tight pb-10  flex flex-col items-center justify-center space-y-5 md:mb-5'>

            {/* Subreddit Name */}
            <h1 className='flex flex-col items-center text-3xl  lg:flex-row lg:space-x-2  lg:text-4xl    '>
                <span>Overview for</span>
                <a
                    href={`https://www.reddit.com/r/${overview.display_name}`}
                    target="_blank" rel="noopener noreferrer"
                    className={`${darkMode ? 'bg-black hover:bg-gray-900' : 'hover:bg-secondary-300 active:bg-secondary-300'} tracking-tight underline underline-offset-8 hover:no-underline  transition-colors ease-in-out duration-200 p-2 rounded-full text-2xl md:text-3xl lg:text-4xl `}>
                    r/ {overview.display_name}
                </a>
            </h1>

            {/* Established */}
            <h2 className='text-sub text-lg md:text-xl '>
                Created on {moment(unix(overview.created_utc)).format('MMMM DD, YYYY')}
            </h2>


            {/* Description */}
            {overview.public_description &&
                <h2 className=' flex flex-col space-y-1 text-sub items-center text-center'>
                    <span className='text-sub text-lg md:text-xl underline underline-offset-4'>Description</span>
                    <p className='text-sub text-base md:text-lg'>{overview.public_description}</p>
                </h2>
            }

            {/* API Disclaimer */}
            <div>
                <p className='text-sub text-xs text-center md:text-base'>
                    *Data is available from 1000 posts ago (Reddit API limitations)
                </p>
                <p className='text-sub text-xs text-center md:text-base'>
                    <span className='ml-3'>*Data From: {dateBegin} - {dateEnds} ({activity.length} Posts)</span>
                </p>
            </div>


        </div>
    )
}

function SubredditSearch({ overview, activity }) {
    const [domLoaded, setDomLoaded] = useState(false)
    const darkMode = useDarkMode()

    useEffect(() => { setDomLoaded(true) }, [])
    return (
        <>
            <Head>
                <title>{`Overview for r/${overview.display_name} - Reddit Analyzer`}</title>
                <meta name="description" content={`Overview for r/${overview.display_name} - Reddit Analyzer`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {domLoaded
                ? <main id="results" className='pt-5 md:py-8 md:px-16 lg:py-16 lg:px-32 mx-auto min-h-[70vh] max-w-[1700px]'>
                    <div className={`${darkMode ? 'bg-black text-secondary-100' : 'bg-secondary-100 text-black'}   py-10 px-5 md:py-14 md:px-10 lg:p-20   md:rounded-xl min-h-[67.5vh] md:min-h-[65vh]`}>
                        <div className={`${darkMode ? 'bg-black text-secondary-100' : 'bg-secondary-100 text-black'}`}>
                            <SubredditOverview overview={overview} activity={activity} />

                            {activity.length > 0
                                ? <HeatMap activity={activity} />

                                : <h1 className='h-[35vh]    text-sub text-2xl flex justify-center items-center'>
                                    Dust.
                                </h1>}


                        </div>
                    </div>
                </main>
                : <Loading />
            }
        </>

    )
}

export default SubredditSearch