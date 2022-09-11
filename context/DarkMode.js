import { useEffect, useContext, useState, createContext } from 'react'

// Context
export const DarkModeContext = createContext()
export const DarkModeUpdateContext = createContext()

// Hook
export function useDarkMode() {
    return useContext(DarkModeContext)
}
export function useToggleDarkMode() {
    return useContext(DarkModeUpdateContext)
}

function DarkModeProvider({ children }) {
    const [mount, setMount] = useState(false)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        let storage = localStorage.getItem('reddit-analyzer') ? JSON.parse(localStorage.getItem('reddit-analyzer')) : null
        if (!storage) {
            localStorage.setItem('reddit-analyzer', JSON.stringify({ darkMode: false }))
            storage = { darkMode: false }
        }

        if (!mount) {
            setIsDark(storage.darkMode)
            setMount(true)
        }
    })



    function toggleDarkMode() {
        localStorage.setItem('reddit-analyzer', JSON.stringify({ "darkMode": !isDark }))
        setIsDark(prevDarkMode => !prevDarkMode)
    }

    return (
        <DarkModeContext.Provider value={isDark}>
            <DarkModeUpdateContext.Provider value={toggleDarkMode}>
                {children}
            </DarkModeUpdateContext.Provider>
        </DarkModeContext.Provider>
    )
}

export default DarkModeProvider