import { useState, useEffect } from 'react'

function useDeviceWidth() {
    const [width, setWidth] = useState(0)

    const handleWidth = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        // component is mounted and window is available
        handleWidth()
        window.addEventListener('resize', handleWidth);
        // unsubscribe from the event on component unmount
        return () => window.removeEventListener('resize', handleWidth);
    }, []);

    return [width]

}

export default useDeviceWidth