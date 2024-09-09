'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';

const AppThemeProvider = (props: { children: React.ReactNode }) => {
  return <AntdRegistry>
    {props.children}
  </AntdRegistry>
}

export default AppThemeProvider;