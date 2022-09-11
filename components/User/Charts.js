import { useEffect, useState } from 'react'

// Utils
import moment from 'moment'
import { unix, toTitleCase } from '../../lib/utils'
import useDeviceWidth from '../../lib/hooks/useDeviceWidth'
import { useDarkMode } from '../../context/DarkMode'

// Components
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';


function Toggle({ toggle, setToggle }) {
    return (
        <div
            onClick={() => setToggle(!toggle)}
            className={`
        ${toggle ? 'bg-analogous-500 hover:bg-analogous-400 active:bg-analogous-400' : 'bg-gray-400 hover:bg-gray-300 active:bg-gray-300'} 
        cursor-pointer inline-block w-[75px] h-[35px]  
        rounded-full relative 
        transition-all ease-in-out duration-200
        `}>

            {/* Button */}
            <div className={`
            select-none text-transparent w-[25px] h-[25px] 
            rounded-full bg-white 
            top-[50%] -translate-y-[50%] left-2 absolute  transition-all ease-in-out duration-200
            ${toggle ? 'translate-x-[35px]' : ''}
            `}>.</div>

        </div>
    )
}

function SingleChart({ array, activity = false, karma = false, type, slots, color }) {
    const [cumulative, setCumaltive] = useState(true)
    const darkMode = useDarkMode()
    const groups = {}
    let oldest;
    let latest;
    let interval = 1

    if (array.length > 1) {
        array.sort((a, b) => {
            let curr = new Date(unix(a.data.created_utc))
            let next = new Date(unix(b.data.created_utc))
            return next - curr
        })


        oldest = moment(unix(array[array.length - 1].data.created_utc))
        latest = moment(unix(array[0].data.created_utc))

        groups[oldest] = 0

        let diff = latest.diff(oldest, 'days')

        if (diff) {
            if (diff > slots) {
                interval = diff / slots
            } else {
                interval = diff
            }
        }

    }


    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function subDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }


    function generateGroups(date) {
        // Next Interval
        const newDate = addDays(date, interval)

        // Base Case
        if (newDate > subDays(latest, interval)) {
            groups[latest] = 0
        } else {
            // Check if New Interval already Exist
            const exist = groups.hasOwnProperty(newDate)
            if (!exist) {
                groups[moment(newDate)] = 0
                generateGroups(newDate)
            }
        }
    }


    if (array.length > 1) {
        generateGroups(oldest)
    } else {
        oldest = moment(unix(array[0].data.created_utc))
        groups[oldest] = 1
        groups[moment(Date.now())] = 0
    }

    function staticData() {
        let dataSet = { ...groups }
        const dateIntervals = Object.keys(dataSet).map((item) => new Date(item)).sort((a, b) => b - a)

        array.forEach(({ data }) => {
            const variable = activity ? 1 : (data["score"] || 0)
            const comment = moment(unix(data.created_utc))
            let found = false
            dateIntervals.forEach((item, idx) => {
                if (!found) {
                    const before = moment(dateIntervals[idx + 1])
                    const after = moment(item)
                    if (comment.isSame(before)) {
                        dataSet[before] = dataSet[before] += variable
                        found = true
                    } else if (comment.isSame(after)) {
                        dataSet[after] = dataSet[after] += variable
                        found = true
                    } else if (comment.isAfter(before) && comment.isBefore(after)) {
                        dataSet[before] = dataSet[before] += variable
                        found = true
                    }
                }
            })


        })

        return Object.entries(dataSet).map((item) => {
            return {
                name: moment(new Date(item[0])).format('YYYY-MM-DD'),
                amt: item[1]
            }
        })
    }
    function cumulativeData() {
        let dataSet = { ...groups }
        const dateIntervals = Object.keys(dataSet).map((item) => new Date(item)).sort((a, b) => b - a)

        array.forEach(({ data }) => {
            const variable = activity ? 1 : (data["score"] || 0)
            const comment = moment(unix(data.created_utc))
            let found = false
            dateIntervals.forEach((item, idx) => {
                if (!found) {
                    const before = moment(dateIntervals[idx + 1])
                    const after = moment(item)
                    if (comment.isSame(before)) {
                        dataSet[before] = dataSet[before] += variable
                        found = true
                    } else if (comment.isSame(after)) {
                        dataSet[after] = dataSet[after] += variable
                        found = true
                    } else if (comment.isAfter(before) && comment.isBefore(after)) {
                        dataSet[before] = dataSet[before] += variable
                        found = true
                    }
                }
            })


        })



        let prevValue;
        return Object.entries(dataSet).map((item, idx) => {
            if (idx === 0) {
                prevValue = item[1]
                return {
                    name: moment(new Date(item[0])).format('YYYY-MM-DD'),
                    amt: item[1]
                }
            } else {
                prevValue += item[1]
                return {
                    name: moment(new Date(item[0])).format('YYYY-MM-DD'),
                    amt: prevValue
                }
            }

        })
    }


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`${darkMode ? 'bg-dark border-gray-900' : 'bg-secondary-100 border-secondary-300'}  opacity-90 p-2 rounded-lg border-2 `}>
                    <p>{label}</p>

                    <p>
                        {`${activity
                            ? `# of ${toTitleCase(type)}: ${payload[0].value}`
                            : `${toTitleCase(type)} Karma: ${payload[0].value}`}`
                        }
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomizedAxisTick = (props) => {
        const { x, y, payload } = props
        return (
            <g transform={`translate(${x},${y})`} className={`text-xs ${darkMode ? 'stroke-secondary-100' : 'stroke-black'}`}>
                <text x={0} y={0} dy={15} textAnchor="end" transform="rotate(-45)">
                    {payload.value}
                </text>
            </g>
        );
    };

    const CustomLegend = () => {
        let legendBG = ''
        if (type === "comments") {
            if (activity) {
                legendBG = 'bg-comment-activity'
            } else {
                legendBG = 'bg-comment-karma'
            }
        } else {
            if (activity) {
                legendBG = 'bg-sub-activity'
            } else {
                legendBG = 'bg-sub-karma'
            }
        }

        return (
            <div className='flex text-sm items-center space-x-2 justify-center'>
                <div className={`${legendBG} w-[40px] h-[20px] rounded-sm text-transparent `}>.</div>
                <span className='flex justify-center'>
                    {`${activity
                        ? `# Num of ${toTitleCase(type)}`
                        : `${toTitleCase(type)} Karma `}`
                    }

                </span>
            </div>
        );
    };




    return (
        <div className='flex flex-col space-y-10 items-center mt-5 overflow-visible'>
            <div className='mb-2.5 flex flex-col items-center space-y-5'>
                <h3 className='text-center  text-3xl'>
                    {`${toTitleCase(type)} ${activity ? 'Activity' : 'Karma'} over time`}
                </h3>

                <div className='flex flex-col space-y-1 xl:space-y-0 xl:space-x-5 xl:flex-row items-center'>
                    <span className='text-lg'>Cumulative</span>
                    <Toggle toggle={cumulative} setToggle={setCumaltive} />
                </div>

            </div>


            {/* Desktop */}
            <div className='hidden xl:inline-block'>
                <AreaChart
                    width={550}
                    height={400}
                    data={cumulative ? cumulativeData() : staticData()}
                    margin={{
                        top: 5,
                        left: 3,
                        right: 5,
                        bottom: 3,
                    }}
                >
                    <XAxis
                        interval={0}
                        tick={<CustomizedAxisTick />}
                        dataKey="name"
                        height={65}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip cursor={false} content={<CustomTooltip />} />
                    <Legend
                        align='center'
                        content={<CustomLegend />}
                        verticalAlign="top"
                        height={30}
                    />
                    <defs>
                        <linearGradient id={`${type}${activity ? 'Activity' : 'Karma'}ColorDeskAmt`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="50%" stopColor={color} stopOpacity={0.9} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="amt"
                        fillOpacity={0.8}
                        fill={`url(#${type}${activity ? 'Activity' : 'Karma'}ColorDeskAmt)`}
                        stroke={color}
                        dot={{ stroke: color, strokeWidth: 2, r: 3 }}
                        activeDot={{ stroke: color, strokeWidth: 2, r: 3.5 }}
                    />
                </AreaChart>
            </div>

            {/* Tablet */}
            <div className='hidden md:inline-block xl:hidden'>
                <AreaChart
                    width={550}
                    height={400}
                    data={cumulative ? cumulativeData() : staticData()}
                    margin={{
                        top: 5,
                        left: -5,
                        right: 10,
                        bottom: 3,
                    }}
                >
                    <XAxis
                        interval={0}
                        tick={<CustomizedAxisTick />}
                        dataKey="name"
                        height={65}
                    />

                    <YAxis
                        allowDecimals={false}
                    />

                    <Tooltip
                        cursor={false}
                        content={<CustomTooltip />}
                    />
                    <Legend
                        align='center'
                        content={<CustomLegend />}
                        verticalAlign="top"
                        height={30}
                    />
                    <defs>
                        <linearGradient id={`${type}${activity ? 'Activity' : 'Karma'}ColorTabAmt`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="50%" stopColor={color} stopOpacity={0.9} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="amt"
                        fillOpacity={0.8}
                        fill={`url(#${type}${activity ? 'Activity' : 'Karma'}ColorTabAmt)`}
                        stroke={color}
                        dot={{ stroke: color, strokeWidth: 2, r: 3 }}
                        activeDot={{ stroke: color, strokeWidth: 2, r: 3.5 }}
                    />
                </AreaChart>
            </div>

            {/* Phone */}
            <div className='md:hidden'>
                <AreaChart
                    width={350}
                    height={400}
                    data={cumulative ? cumulativeData() : staticData()}
                    margin={{
                        top: 5,
                        left: -5,
                        right: 10,
                        bottom: 3,
                    }}
                >
                    <XAxis
                        interval={0}
                        tick={<CustomizedAxisTick />}
                        dataKey="name"
                        height={65}
                    />

                    <YAxis
                        allowDecimals={false}
                    />

                    <Tooltip
                        cursor={false}
                        content={<CustomTooltip />}
                    />

                    <Legend
                        align='center'
                        content={<CustomLegend />}
                        verticalAlign="top"
                        height={30}
                    />
                    <defs>
                        <linearGradient id={`${type}${activity ? 'Activity' : 'Karma'}PhoneTabAmt`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="50%" stopColor={color} stopOpacity={0.9} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="amt"
                        fillOpacity={0.8}
                        fill={`url(#${type}${activity ? 'Activity' : 'Karma'}PhoneTabAmt)`}
                        stroke={color}
                        dot={{ stroke: color, strokeWidth: 2, r: 3 }}
                        activeDot={{ stroke: color, strokeWidth: 2, r: 3.5 }}
                    />
                </AreaChart>
            </div>


        </div>
    )
}

function Charts({ data, type, color1, color2 }) {
    const screenWidth = useDeviceWidth()
    const [slots, setSlots] = useState(15)

    useEffect(() => {
        if (screenWidth < 767 && slots !== 7) {
            setSlots(7)
        }
        if (screenWidth >= 767 && slots !== 15) {
            setSlots(15)
        }
    }, [screenWidth, slots])

    return (
        <div className='py-10 pb-20  border-b-2 flex flex-col space-y-16 xl:space-y-0 xl:flex-row justify-around xl:pt-10 xl:px-10 xl:pb-15 '>
            {data.length > 0
                ? <>
                    <SingleChart
                        activity={true}
                        array={data}
                        type={type}
                        slots={slots}
                        color={color1}
                    />
                    <SingleChart
                        karma={true}
                        array={data}
                        type={type}
                        slots={slots}
                        color={color2}
                    />
                </>
                : <div className='pt-10 flex justify-center items-center'>
                    <h1 className='text-3xl text-sub capitalize'>{`No ${type}`}</h1>
                </div>
            }

        </div>
    )
}

export default Charts