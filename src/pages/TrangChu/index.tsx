import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, CodeSandboxOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';

const TrangChu: React.FC = () => {
  const { tasks } = useModel('useTaskModel');
  const { initialState } = useModel('@@initialState');

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t: any) => t.status === 'Đã xong').length || 0;
  const myTasks = tasks?.filter((t: any) => t.assignee === initialState?.currentUser?.name).length || 0;

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng số công việc"
              value={totalTasks}
              prefix={<CodeSandboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Công việc đã hoàn thành"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Công việc của tôi"
              value={myTasks}
              prefix={<CodeSandboxOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h1>Chào mừng, {initialState?.currentUser?.name || 'Người dùng'}</h1>
        <p>Đây là hệ thống quản lý công việc nhóm. Bạn có thể sử dụng menu "Quản lý công việc" bên trái để kiểm tra và tiến hành làm việc.</p>
      </Card>
    </PageContainer>
  );
};

export default TrangChu;
