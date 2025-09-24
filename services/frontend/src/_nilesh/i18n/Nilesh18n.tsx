import { createContext, FC, useContext } from "react"
import { WithChildren } from "../helper/react18MigrationHelper"

type Props = {
    selectedLang:
     'de' | 'en' | 'es' | 'fr' | 'ja'
}

const initialState: Props = {
    selectedLang:'en',
}

function getConfig(): Props {
    const ls = localStorage.getItem('i18Config')
    if(ls){
        try {
            return JSON.parse(ls) as Props
        } catch (error) {
            console.error(error);
            
        }
    }
    return initialState;
}

export function setLanguage(lang: string){
    localStorage.setItem('i18Config',JSON.stringify({selectedLang:lang}))
    window.location.reload();
}

const I18nContext = createContext<Props>(initialState);

const useLang = () =>{
    return useContext(I18nContext).selectedLang;
}

const NileshI18nProvider: FC<WithChildren> = ({children}) => {
    const lang = getConfig()
    return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>
  }

export {NileshI18nProvider,useLang}