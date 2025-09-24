import { ReactNode } from "react"


type WithChildren = {
    children?: ReactNode
}

const reInitMenu = () => {
    // setTimeout(()=>{
    //     MenuComponent.reinitialzation()
    // },500)
}

export { type WithChildren, reInitMenu }