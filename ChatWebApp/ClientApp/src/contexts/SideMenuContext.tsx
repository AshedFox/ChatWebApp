import React, {createContext, FC, useContext, useState} from 'react';

export const SideMenuContext = createContext({
    isOpen: false,
    handleIsOpenChange: (state: boolean) => {}
})

const SideMenuProvider:FC = ({children}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleIsOpenChange = (state: boolean) => {
        setIsOpen(state);
    }

    return (
        <SideMenuContext.Provider value={{
            isOpen, handleIsOpenChange
        }}>
            {children}
        </SideMenuContext.Provider>
    );
};

export const useSideMenu = () => {
    return useContext(SideMenuContext);
}

export default SideMenuProvider;
