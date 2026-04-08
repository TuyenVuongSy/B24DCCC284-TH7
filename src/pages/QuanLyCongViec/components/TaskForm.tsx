import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const { Option } = Select;

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const { accounts } = useModel('useUserModel');

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        deadline: initialValues.deadline ? moment(initialValues.deadline) : null,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
      });
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? 'Sửa công việc' : 'Thêm công việc mới'}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="task_form"
        initialValues={{ status: 'Chưa làm', priority: 'Trung bình' }}
      >
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item
          name="assignee"
          label="Người được giao"
          rules={[{ required: true, message: 'Vui lòng chọn người được giao!' }]}
        >
          <Select placeholder="Chọn người được giao">
            {accounts.map((acc: any) => (
              <Option key={acc.username} value={acc.username}>
                {acc.username} ({acc.role})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
        >
          <Select>
            <Option value="Thấp">Thấp</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Cao">Cao</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Hạn hoàn thành"
          rules={[{ required: true, message: 'Vui lòng chọn hạn hoàn thành!' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Option value="Chưa làm">Chưa làm</Option>
            <Option value="Đang làm">Đang làm</Option>
            <Option value="Đã xong">Đã xong</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
