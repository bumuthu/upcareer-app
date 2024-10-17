import { UserCircleIcon } from '@heroicons/react/16/solid';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react'
import UserSettings from './UserSettings';
import SubscriptionSettings from './SubscriptionSettings';
import ContactUs from './ContactUs';
import { ContactsOutlined, DollarCircleOutlined, DollarOutlined, MoneyCollectOutlined, PlusOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { SettingsTabsKey } from '@/models/enum';

const tabs = [
  {
    label: "User Settings",
    key: SettingsTabsKey.USER_SETTINGS,
    icon: <UserOutlined />,
    children: <UserSettings/>
  },
  {
    label: "Subscription",
    key: SettingsTabsKey.SUBSCRIPTION,
    icon: <DollarOutlined />,
    children: <SubscriptionSettings/>
  },
  {
    label: "Contact Us",
    key: SettingsTabsKey.CONTACT_US,
    icon: <ContactsOutlined />,
    children: <ContactUs/>
  },
]

const SettingsTabs = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
 
  const currentTab = searchParams.get('tab') || SettingsTabsKey.USER_SETTINGS;

  const handleTabChange = (key: string) => {  
    router.push(`/my-account/?tab=${key}`);
  };
  return (
    <Tabs
    addIcon
    size='large'
    animated
    onChange={handleTabChange}
    activeKey={currentTab}
    centered
    items={tabs.map(({label, key, icon, children}) => {
      return {
        label: label,
        key: key ,
        children: children,
        icon: icon
      };
    })}
  />
  )
}

export default SettingsTabs