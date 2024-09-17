import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../../context/GlobalContext';
import { useAuthContext } from '../../context/AuthContext';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const context = useGlobalContext();
    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (!isAuthenticated && !context.isLoading) {
            console.log("Not authenticated")
        }
    }, [isAuthenticated]);

    return isAuthenticated ? children :
          <Result
    status="error"
    title="Submission Failed"
    subTitle="Please check and modify the following information before resubmitting."
    extra={[
      <Button type="primary" key="console">
        Go Console
      </Button>,
      <Button key="buy">Buy Again</Button>,
    ]}
  >
    <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          The content you submitted has the following error:
        </Text>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been
        frozen. <a>Thaw immediately &gt;</a>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet
        eligible to apply. <a>Apply Unlock &gt;</a>
      </Paragraph>
    </div>
  </Result>
};

export default AuthGuard;