import Footer from '@/components/Footer';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { accounts } = useModel('useUserModel');
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password?: string }) => {
    try {
      setSubmitting(true);
      if (!values.username.trim()) {
        message.error('Vui lòng nhập tên người dùng');
        setSubmitting(false);
        return;
      }

      const account = accounts.find(
        (acc: any) => acc.username === values.username && acc.password === values.password
      );

      if (!account) {
        message.error('Sai tên đăng nhập hoặc mật khẩu!');
        setSubmitting(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem('username', values.username);
      
      // Update initialState
      setInitialState((s: any) => ({
        ...s,
        currentUser: { name: values.username } as any,
      }));

      message.success('Đăng nhập thành công!');
      history.push('/dashboard');
    } catch (error) {
      message.error('Đăng nhập thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img alt='logo' className={styles.logo} src='/logo-full.svg' />
            </div>
            <div className={styles.desc}>Đăng nhập Ứng dụng Quản lý Công việc Nhóm</div>
          </div>
        </div>

        <div className={styles.main}>
          <div style={{ marginBottom: 24, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
            Đăng nhập hệ thống
          </div>

          <Alert
            style={{ marginBottom: 24 }}
            message="Tài khoản mẫu để thử nghiệm:"
            description={
              <div>
                {accounts.map((acc: any, index: number) => (
                  <div key={index} style={{ marginTop: 4 }}>
                    Mẫu {index + 1}: <a onClick={() => {
                      form.setFieldsValue({ username: acc.username, password: acc.password });
                    }}>
                      <b>{acc.username}</b> / mật khẩu: <b>{acc.password}</b> ({acc.role})
                    </a>
                  </div>
                ))}
              </div>
            }
            type="info"
            showIcon
          />

          <Form
            form={form}
            onFinish={handleSubmit}
            layout='vertical'
          >
            <Form.Item label='' name='username' rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
              <Input
                placeholder='Nhập tên đăng nhập của bạn...'
                prefix={<UserOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Form.Item label='' name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input.Password
                placeholder='Nhập mật khẩu của bạn...'
                prefix={<LockOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Button type='primary' block size='large' loading={submitting} htmlType="submit">
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
      <div className='login-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
