import { useEffect, useState, useRef } from 'react'

// Next
import { useRouter } from 'next/router'

// Context
import { useDarkMode, useToggleDarkMode } from '../context/DarkMode'

// Icons
import { ImFire } from 'react-icons/im'
import { FiSearch } from 'react-icons/fi'
import { FaRocket, FaReddit } from 'react-icons/fa'
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md'
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs'


function DarkModeToggle() {
    const darkMode = useDarkMode()
    const toggleDarkMode = useToggleDarkMode()
    return (
        <button type="button" className='absolute top-5 right-5 z-[100] transition-colors ease-in-out duration-200'>
            {darkMode
                ? <MdDarkMode onClick={toggleDarkMode} className='text-secondary-600 text-[2rem] xl:text-[3rem] cursor-pointer' />
                : <MdOutlineDarkMode onClick={toggleDarkMode} className='text-secondary-600 text-[2rem] xl:text-[3rem] cursor-pointer' />
            }
        </button>
    )
}

function SearchInput({ type, inputRef, handleFormSubmit }) {
    const [search, setSearch] = useState('')
    const darkMode = useDarkMode()
    return (
        <div className='flex justify-center md:w-max transition-all duration-150'>
            {/* Search Input */}
            <label htmlFor={`${type === "user" ? 'userSearch' : "subredditSearch"}`} className={` ${darkMode ? ' ring-gray-900' : 'ring-secondary-300'} ring-1  flex  relative   rounded-sm `}>
                <span className={`${darkMode ? 'bg-gray-900 text-secondary-100 border-r-gray-900' : 'bg-secondary-300 border-r-secondary-300 text-black'} border-r-[1px] flex items-center justify-center rounded-l-sm select-none w-[50px] h-[99%] text-center  absolute left-[0.1px] top-[50%] -translate-y-[50%] `}>
                    {type === "user" ? 'u/' : "r/"}
                </span>

                <input
                    ref={inputRef}
                    id={`${type === "user" ? 'userSearch' : "subredditSearch"}`}
                    placeholder={`${type === "user" ? 'Search Username' : "Search Subreddit"}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${darkMode ? 'bg-gray-800 text-secondary-100 hover:bg-gray-900 focus:bg-gray-900' : 'bg-[#F6F7F8] hover:bg-white text-black focus:bg-white'} py-2.5 pl-16  pr-[4rem] md:pr-[4.2rem]  hover:ring-[1px] hover:ring-analogous-500  focus:outline-[1px]  focus:ring-0   focus:outline-offset-1 focus:outline-analogous-500  rounded-sm transition-all ease-in-out duration-100 active:outline-analogous-500`}
                />
                {/* Submit Button */}
                <button type="submit" onClick={(e) => handleFormSubmit(e, search, `${type === "user" ? 'user' : "subreddit"}`)} className={`flex  md:space-x-2 justify-center items-center absolute  rounded-r-sm right-[0.1px] px-3 top-0 h-[99%]  select-none   min-w-[50px] border-l-[1px] ${darkMode ? 'bg-gray-900 text-secondary-100 border-l-gray-900 ' : 'bg-secondary-300 border-r-secondary-300 text-black hover:bg-secondary-400'} transition-all ease-in duration-100`}>
                    <FiSearch className='' />
                </button>
            </label>
        </div>
    )
}

function Form({ setIsLoading }) {
    const [option, setOption] = useState('user')
    const [showMenu, setShowMenu] = useState(false)
    const [hiddenDelay, setHiddenDelay] = useState(false)
    const inputRef = useRef(null)
    const darkMode = useDarkMode()
    const router = useRouter()

    async function handleFormSubmit(e, search, category) {
        e.preventDefault()
        if (search) {
            setIsLoading(true)
            router.push(`/${category}/${search}`)
        }
    }

    function handleShow() {
        setShowMenu(!showMenu)
        if (!hiddenDelay) {
            setHiddenDelay(!hiddenDelay)
        } else {
            setTimeout(() => {
                setHiddenDelay(!hiddenDelay)
            }, 300)
        }
    }

    function handleOptionClick() {
        handleShow()
        if (option === 'user') {
            setOption('subreddit')
        } else {
            setOption('user')
        }
    }

    return (
        <>

            <form>
                <div className='hidden lg:flex flex-row space-x-10 mt-5 '>
                    <SearchInput type="user" inputRef={inputRef} handleFormSubmit={handleFormSubmit} />
                    <SearchInput type="subreddit" inputRef={inputRef} handleFormSubmit={handleFormSubmit} />
                </div>
                <div className='flex flex-col items-center lg:hidden'>


                    <div className={`inline-block mx-auto mb-5 relative ${hiddenDelay ? 'overflow-visible' : ''}`}>
                        <span onClick={handleShow} className={`${darkMode ? ' text-secondary-100' : ' text-black'} k z-10 capitalize cursor-pointer select-none md:text-lg`}>
                            {option} {showMenu ? <BsCaretUpFill className='inline-block' /> : <BsCaretDownFill className='inline-block' />}
                        </span>


                        <div
                            onClick={handleOptionClick}
                            className={`
                ${hiddenDelay ? 'inline-block' : ''}
               ${showMenu ? 'scale-100 opacity-100 z-10' : 'text-transparent scale-[.4] opacity-0 -translate-y-[25px] select-none z-0'}
                absolute -translate-x-[50%] left-[50%] top-7 cursor-pointer
                ${darkMode ? 'bg-black active:bg-gray-900 text-secondary-100' : 'bg-white active:bg-gray-100'}  active:scale-110 p-3  drop-shadow-md rounded-sm text-gray-800 
                transition-all ease-in-out select-none
                `}>
                            <span>{option === 'user' ? 'Subreddit' : 'User'}</span>
                        </div>

                    </div>



                </div>
            </form>
        </>
    )

}

function Header({ setIsLoading }) {
    const darkMode = useDarkMode()
    const router = useRouter()
    return (
        <div onClick={() => router.push('/')} className={`${darkMode ? 'bg-black text-secondary-100' : 'bg-secondary-100 text-black'} transition-all ease-in-out duration-150 relative w-full flex flex-col items-center justify-center  p-10 drop-shadow-lg h-[30vh] rounded-b-lg md:rounded-b-xl`}>
            <div className='cursor-pointer flex flex-col items-center mb-4 lg:mb-3'>
                <FaReddit className='text-primary-500 text-[5rem] lg:text-[7rem]' />
                <h1 className={`${darkMode ? ' text-secondary-100' : ' text-black'} transition-all duration-150 text-4xl  flex items-center select-none tracking-tight`}>
                    <span className=''>
                        redd
                        <span className='relative'>
                            i
                            <span className='text-5xl absolute top-[6px] left-[1.25px] w-[7px] h-[7px] rounded-full bg-primary-500'></span>
                        </span>
                        t
                    </span>


                    <span>
                        -analyzer
                    </span>

                </h1>
                <Form setIsLoading={setIsLoading} />

            </div>
        </div>
    )
}

export function Loading() {
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

function Layout({ children }) {
    const darkMode = useDarkMode()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (router.query.search) {
            setIsLoading(false)
        }
    }, [router.query.search])



    return (

        <div className={`${darkMode ? 'bg-gray-900 text-secondary-100' : 'bg-[#DAE0E6] text-black'} transition-all ease-in-out duration-150 relative font-body min-h-screen`}>
            <div className='max-w-[1980px]  mx-auto'>
                <Header setIsLoading={setIsLoading} />

                <DarkModeToggle />
                {isLoading && <Loading />}



                {children}


            </div>
        </div>


    )
}

export default Layout