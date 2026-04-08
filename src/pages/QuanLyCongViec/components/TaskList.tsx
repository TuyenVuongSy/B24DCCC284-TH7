import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Select, Tag, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { Task } from '@/models/useTaskModel';
import TaskForm from './TaskForm';

const { Option } = Select;

interface TaskListProps {
  taskModel: any;
  viewMode: 'all' | 'mine';
}

const statusColors = {
  'Chưa làm': 'default',
  'Đang làm': 'processing',
  'Đã xong': 'success',
};

const priorityColors = {
  'Thấp': 'green',
  'Trung bình': 'orange',
  'Cao': 'red',
};

const TaskList: React.FC<TaskListProps> = ({ taskModel, viewMode }) => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser?.name || '';
  
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return taskModel.tasks.filter((task: Task) => {
      // If "mine" view is active, restrict to current user
      if (viewMode === 'mine' && task.assignee !== currentUser) {
        return false;
      }
      
      const matchSearch = task.name.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? task.status === statusFilter : true;
      const matchAssignee = assigneeFilter ? task.assignee === assigneeFilter : true;
      
      return matchSearch && matchStatus && matchAssignee;
    });
  }, [taskModel.tasks, viewMode, currentUser, searchText, statusFilter, assigneeFilter]);

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: Task) => {
    setEditingTask(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    taskModel.deleteTask(id);
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priorityColors[priority as keyof typeof priorityColors]}>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Hạn hoàn thành',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Extract unique assignees for the filter dropdown
  const uniqueAssignees = Array.from(new Set(taskModel.tasks.map((t: Task) => t.assignee)));

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="Tìm kiếm công việc..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        
        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Option value="Chưa làm">Chưa làm</Option>
          <Option value="Đang làm">Đang làm</Option>
          <Option value="Đã xong">Đã xong</Option>
        </Select>

        {viewMode === 'all' && (
          <Select
            allowClear
            placeholder="Lọc theo người giao"
            onChange={setAssigneeFilter}
            style={{ width: 180 }}
          >
            {uniqueAssignees.map((a: any) => (
              <Option key={a} value={a}>{a}</Option>
            ))}
          </Select>
        )}

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginLeft: 'auto' }}>
          Thêm công việc
        </Button>
      </div>

      <Table
        dataSource={filteredTasks}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <TaskForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={(values) => {
          if (editingTask) {
            taskModel.editTask(editingTask.id, values);
          } else {
            taskModel.addTask(values);
          }
          setIsModalVisible(false);
        }}
        initialValues={editingTask}
      />
    </div>
  );
};

export default TaskList;
