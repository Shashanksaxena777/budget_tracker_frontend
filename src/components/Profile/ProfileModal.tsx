import { Modal, Avatar, Typography, Space, Divider, Card, Row, Col, Tag } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    username?: string;
    email?: string;
    id?: string;
  };
}

const ProfileModal = ({ open, onClose, user }: ProfileModalProps) => {
  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      bodyStyle={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}
    >
      <Card
        bordered={false}
        style={{
          textAlign: 'center',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {/* Avatar Section */}
        <Space direction="vertical" align="center" style={{ width: '100%', marginTop: 12 }}>
          <Avatar
            size={96}
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            icon={<UserOutlined />}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Title level={4} style={{ marginTop: 8 }}>
            {user.username || 'Unknown User'}
          </Title>
          <Tag color="blue" style={{ fontSize: 13 }}>
            Active Member
          </Tag>
        </Space>

        <Divider style={{ margin: '16px 0' }} />

        {/* User Info Section */}
        <Row gutter={[0, 12]} style={{ textAlign: 'left', padding: '0 24px 16px 24px' }}>
          <Col span={24}>
            <Space>
              <IdcardOutlined style={{ color: '#1677ff' }} />
              <Text strong>User ID:</Text>
              <Text type="secondary">{user.id || 'N/A'}</Text>
            </Space>
          </Col>
          <Col span={24}>
            <Space>
              <MailOutlined style={{ color: '#1677ff' }} />
              <Text strong>Email:</Text>
              <Text type="secondary">{user.email || 'N/A'}</Text>
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: '0' }} />

        {/* Footer Section */}
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '10px 0',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Budget Tracker © {new Date().getFullYear()}
          </Text>
        </div>
      </Card>
    </Modal>
  );
};

export default ProfileModal;
