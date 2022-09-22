// Hooks
import { useState, useRef } from "react"
import { useDarkMode } from "../../context/DarkMode"
import { useRouter } from "next/router"

// Icons
import { BsCaretUpFill, BsCaretDownFill } from 'react-icons/bs'

// Component
import SearchInput from "./SearchInput"




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
        <form role="form" aria-label="form">
            <div className='hidden lg:flex flex-row space-x-10 mt-5 '>
                <SearchInput type="user" inputRef={inputRef} handleFormSubmit={handleFormSubmit} />
                <SearchInput type="subreddit" inputRef={inputRef} handleFormSubmit={handleFormSubmit} />
            </div>
            <div className='flex flex-col items-center lg:hidden'>


                <div className={`inline-block mx-auto my-3 relative ${hiddenDelay ? 'overflow-visible' : ''}`}>
                    <span onClick={handleShow} className={`${darkMode ? ' text-secondary-100' : ' text-black'} k z-10 capitalize cursor-pointer select-none md:text-lg`}>
                        {option} {showMenu ? <BsCaretUpFill className='inline-block' /> : <BsCaretDownFill className='inline-block' />}
                    </span>


                    <div
                        onClick={handleOptionClick}
                        className={`
                ${hiddenDelay ? 'inline-block' : ''}
               ${showMenu ? 'scale-100 opacity-100 z-10' : 'text-transparent scale-[.4] opacity-0 -translate-y-[25px] select-none z-0'}
                absolute -translate-x-[50%] left-[50%] top-7 cursor-pointer
                ${darkMode ? 'bg-black active:bg-gray-900 text-secondary-100' : 'bg-white active:bg-gray-100'}  active:scale-110 p-3  drop-shadow-md rounded-sm 
                transition-all ease-in-out select-none
                `}>
                        <span>{option === 'user' ? 'Subreddit' : 'User'}</span>
                    </div>

                </div>
                {option === "user"
                    ? <SearchInput type="user" inputRef={inputRef} handleFormSubmit={handleFormSubmit} />

                    : <SearchInput type="subreddit" inputRef={inputRef} handleFormSubmit={handleFormSubmit} />
                }


            </div>
        </form>
    )

}

export default Form