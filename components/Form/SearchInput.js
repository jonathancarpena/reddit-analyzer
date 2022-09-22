// Hooks
import { useState } from "react"
import { useDarkMode } from "../../context/DarkMode"

// Icons
import { FiSearch } from "react-icons/fi"

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
                    label={`input-${type}`}
                    ref={inputRef}
                    id={`${type === "user" ? 'userSearch' : "subredditSearch"}`}
                    placeholder={`${type === "user" ? 'Search Username' : "Search Subreddit"}`}
                    value={search}
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${darkMode ? 'bg-gray-800 text-secondary-100 hover:bg-gray-900 focus:bg-gray-900' : 'bg-[#F6F7F8] hover:bg-white text-black focus:bg-white'} py-2.5 pl-16  pr-[4rem] md:pr-[4.2rem]  hover:ring-[1px] hover:ring-analogous-500  focus:outline-[1px]  focus:ring-0   focus:outline-offset-1 focus:outline-analogous-500  rounded-sm transition-all ease-in-out duration-100 active:outline-analogous-500`}
                />
                {/* Submit Button */}
                <button data-testid={`${type}-search-button`} type="submit" onClick={(e) => handleFormSubmit(e, search, `${type === "user" ? 'user' : "subreddit"}`)} className={`flex  md:space-x-2 justify-center items-center absolute  rounded-r-sm right-[0.1px] px-3 top-0 h-[99%]  select-none   min-w-[50px] border-l-[1px] ${darkMode ? 'bg-gray-900 text-secondary-100 border-l-gray-900 ' : 'bg-secondary-300 border-r-secondary-300 text-black hover:bg-secondary-400'} transition-all ease-in duration-100`}>
                    <FiSearch className='' />
                </button>
            </label>
        </div>
    )
}

export default SearchInput