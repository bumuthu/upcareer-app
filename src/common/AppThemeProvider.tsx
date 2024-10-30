'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';

export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

const AppThemeProvider = (props: { children: React.ReactNode }) => {
  return <AntdRegistry>
    {props.children}
  </AntdRegistry>
}

export default AppThemeProvider;