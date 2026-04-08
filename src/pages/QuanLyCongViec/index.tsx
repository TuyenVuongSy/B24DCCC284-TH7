import React from 'react';
import { Tabs } from 'antd';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';

const QuanLyCongViec: React.FC = () => {
  const taskModel = useModel('useTaskModel');

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Danh sách tất cả" key="1">
          <TaskList taskModel={taskModel} viewMode="all" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Công việc của tôi" key="2">
          <TaskList taskModel={taskModel} viewMode="mine" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lịch" key="3">
          <CalendarView taskModel={taskModel} />
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default QuanLyCongViec;
