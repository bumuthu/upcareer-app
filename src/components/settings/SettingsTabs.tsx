import { UserCircleIcon } from '@heroicons/react/16/solid';
import { Tabs } from 'antd';
import React from 'react'
import UserSettings from './UserSettings';
import SubscriptionSettings from './SubscriptionSettings';
import ContactUs from './ContactUs';
import { ContactsOutlined, DollarCircleOutlined, DollarOutlined, MoneyCollectOutlined, PlusOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';

const tabs = [
  {
    label: "User Settings",
    key: "USER_SETTINGS",
    icon: <UserOutlined />,
    children: <UserSettings/>
  },
  {
    label: "Subscription",
    key: "SUBSCRIPTION",
    icon: <DollarOutlined />,
    children: <SubscriptionSettings/>
  },
  {
    label: "Contact Us",
    key: "CONTACT_US",
    icon: <ContactsOutlined />,
    children: <ContactUs/>
  },
]

const SettingsTabs = () => {
  return (
    <Tabs
    addIcon
    size='large'
    animated
    defaultActiveKey="1"
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