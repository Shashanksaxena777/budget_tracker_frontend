import { useState } from 'react';
import { Card, Input, Button, Space, Typography, Spin, Avatar, Empty } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../api/axios';
import './AIAdvisor.css';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await api.post('/api/ai/advice/', {
        question: userMessage.content
      });

      // Add AI response
      const aiMessage: Message = {
        role: 'ai',
        content: response.data.advice,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Title level={2}>AI Financial Advisor</Title>
      <Text type="secondary">Get personalized financial advice based on your spending patterns</Text>

      <Card style={{ marginTop: 24, minHeight: 500 }}>
        <div className="chat-container">
          {messages.length === 0 ? (
            <Empty
              description="Ask me anything about your finances!"
              image={<RobotOutlined style={{ fontSize: 64, color: '#1677ff' }} />}
            >
              <Space direction="vertical">
                <Button type="link" onClick={() => setQuestion("How can I save more money?")}>
                  "How can I save more money?"
                </Button>
                <Button type="link" onClick={() => setQuestion("What's my biggest expense?")}>
                  "What's my biggest expense?"
                </Button>
                <Button type="link" onClick={() => setQuestion("Am I on track with my budget?")}>
                  "Am I on track with my budget?"
                </Button>
              </Space>
            </Empty>
          ) : (
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <Avatar
                    icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: msg.role === 'user' ? '#1677ff' : '#52c41a'
                    }}
                  />
                  <div className="message-content">
                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Paragraph>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message ai">
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  <Spin />
                </div>
              )}
            </div>
          )}
        </div>

        <Space.Compact style={{ width: '100%', marginTop: 16 }}>
          <TextArea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything about your finances..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            disabled={!question.trim()}
          >
            Send
          </Button>
        </Space.Compact>
      </Card>
    </DashboardLayout>
  );
};

export default AIAdvisor;