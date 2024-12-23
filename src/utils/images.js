// Function to get the correct public URL for images
export const getImageUrl = (name) => {
    return new URL(`/images/${name}`, import.meta.url).href
}

import asset1 from '../assets/asset1.png'
import asset2 from '../assets/asset2.png'
import asset3 from '../assets/asset3.png'
import task from '../assets/task.png'
import checklist from '../assets/checklist.png'
import session from '../assets/session.png'

export const images = {
    asset1,
    asset2,
    asset3,
    task,
    checklist,
    session
}
