// Context Hooks
import { useToggleDarkMode, useDarkMode } from "../../context/DarkMode"

// Icons
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md'

function DarkModeToggle() {
    const darkMode = useDarkMode()
    const toggleDarkMode = useToggleDarkMode()
    return (
        <button data-testid="darkModeToggle" name="darkModeToggle" aria-label='darkModeToggle' className='absolute top-5 right-5 z-[100] transition-colors ease-in-out duration-200 flex flex-col justify-center items-center'>
            {darkMode
                ? <span data-testid="moon"><MdDarkMode onClick={toggleDarkMode} className='text-secondary-900 text-[2rem] xl:text-[3rem] cursor-pointer' /></span>
                : <span data-testid="moon-fill"><MdOutlineDarkMode onClick={toggleDarkMode} className='text-secondary-900 text-[2rem] xl:text-[3rem] cursor-pointer' /></span>
            }

        </button>
    )
}

export default DarkModeToggle
