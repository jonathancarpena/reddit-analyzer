import { useEffect, useState } from 'react'

// Next
import { useRouter } from 'next/router'

// Context
import { useDarkMode } from '../../context/DarkMode'

// Components
import DarkModeToggle from '../DarkModeToggle'
import Form from '../Form'
import Loading from '../Loading'

// Icons
import { FaReddit } from 'react-icons/fa'




function Header({ setIsLoading }) {
    const darkMode = useDarkMode()
    const router = useRouter()
    return (
        <div onClick={() => router.push('/')} className={`${darkMode ? 'bg-black text-secondary-100' : 'bg-secondary-100 text-black'} transition-all ease-in-out duration-150 relative w-full flex flex-col items-center justify-center  p-10 drop-shadow-lg h-[30vh] rounded-b-lg md:rounded-b-xl`}>
            <div data-testid="reddit-analyzer-header" className='cursor-pointer flex flex-col items-center mb-4 lg:mb-3'>
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

        <div data-testid="header-bg" className={`${darkMode ? 'bg-gray-900 text-secondary-100' : 'bg-[#DAE0E6] text-black'} transition-all ease-in-out duration-150 relative font-body min-h-screen`}>
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