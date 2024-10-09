import React, { ReactElement, createContext, memo, useContext, useEffect, useState } from 'react';
import useNotification from 'antd/es/notification/useNotification';
import { IContextType, NotificationPlacement } from '../types';


const INITIAL_STATE : IContextType = {
  theme: "light",
  setTheme: () => { },
  collapsed: {collapsed:false,show:true},
  setCollapsed: () => { },
  collapsedSetting: true,
  setCollapsedSetting: () => { },
  contextHolder: <div></div>,
  api: {
    success: () => { },
    error: () => { },
    info: () => { },
    warning: () => { },
    open: () => { },
    destroy: () => { }
  },
  openNotification: () => { },
  searchWord: '',
  setSearchWord: () => { },
}



const Context = createContext<IContextType>(INITIAL_STATE);

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<{collapsed:boolean,show:boolean}>({collapsed:false,show:true});
  const [collapsedSetting, setCollapsedSetting] = useState<boolean>(true);
  const [searchWord, setSearchWord] = useState<string>("");
  const [api, contextHolder] = useNotification();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      localStorage.setItem('theme','dark')
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme',"light")
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

// ============= notification
const openNotification = ({ placement, description, pauseOnHover = true, icon }: { placement: NotificationPlacement, description: string, pauseOnHover?: boolean, icon?: ReactElement }) => {
  api.open({
    icon,
    message: `${placement}`,
    description,
    placement: placement,
    showProgress: true,
    pauseOnHover,
  });
};

// =============== value
const value = {
  theme,
  setTheme,
  collapsed,
  setCollapsed,
  collapsedSetting,
  setCollapsedSetting,
  contextHolder,
  api,
  openNotification,
  searchWord,
  setSearchWord
}
return (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);
};
export default memo(ContextProvider)
export const useMainContext = () => useContext(Context)