import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Row, 
  Col, 
  Typography,
  Space, 
  Divider, 
  Card, 
  Avatar, 
  List,
  Breadcrumb,
  Image,
  Flex,
  Button
} from 'antd';
import { UserOutlined, SendOutlined, HomeOutlined, TagOutlined, EyeOutlined, CalendarOutlined, ClockCircleFilled, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import NewsListSidebar from '../components/NewsListSideBar';
import { vi } from 'date-fns/locale';

const { Title, Paragraph, Text } = Typography;

const NewsDetails = () => {
  const { id } = useParams();
  const [newsData, setNewsData] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentUsername, setCommentUsername] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentPhone, setCommentPhone] = useState(''); 
  const [commentEmail, setCommentEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5000/news');
        const tags = response.data.reduce((acc, news) => {
          if (news.tags) {
            news.tags.forEach((tag) => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        setAllTags(tags);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thẻ:', error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/news/${id}`);
        setNewsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!commentUsername.trim() || !commentContent.trim()) {
      return;
    }

    setSubmitting(true);

    const newComment = {
      username: commentUsername,
      content: commentContent,
      phone: commentPhone,
      email: commentEmail,
      created_at: new Date().toISOString()
    };

    try {
      const updatedComments = [...(newsData.comments || []), newComment];
      
      await axios.patch(`http://localhost:5000/news/${id}`, {
        comments: updatedComments
      });

      setNewsData({
        ...newsData,
        comments: updatedComments
      });

      setCommentUsername('');
      setCommentContent('');
      setCommentPhone('');
      setCommentEmail('');
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'HH:mm:ss', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const CommentItem = ({ author, avatar, content, datetime }) => (
    <div className="mb-4">
      <Flex align="start" gap={12}>
        <Avatar icon={avatar} size="large" />
        <div className="flex-1">
          <Flex justify="space-between" align="center">
            <Text strong>{author}</Text>
            <Text type="secondary" className="text-xs">{datetime}</Text>
          </Flex>
          <div className="mt-1">
            <Text>{content}</Text>
          </div>
        </div>
      </Flex>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12 px-12">
        <Typography.Title level={3}>Đang tải bài viết...</Typography.Title>
      </div>
    );
  }

   if (!newsData) {
    return (
      <div className="text-center py-12 px-12">
        <Typography.Title level={3}>Không tìm thấy bài viết</Typography.Title>
        <Button type="primary">
          <Link to="/news">Quay lại danh sách tin tức</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-4 px-2.5">
      <Breadcrumb className="mb-5" items={[
        { title: <Link to="/"><HomeOutlined /> Trang chủ</Link> },
        { title: <Link to="/news">Tin tức</Link> },
        { title: newsData.title }
      ]} />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <NewsListSidebar
            tags={allTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
        </Col>
        <Col xs={24} lg={18}>
          {/* Phần nội dung bài viết */}
          <Card variant="borderless" style={{ marginTop: "24px", boxShadow: "none" }}
          >
            <Title level={2}>{newsData.title}</Title>
            
            <div className="flex items-center mb-5 space-x-4 text-gray-500">
              <span className="flex items-center">
                <CalendarOutlined className="mr-1" style={{color: "green"}}/>
                <Text type="secondary">
                  {formatDate(newsData.created_at)}
                </Text>
              </span>
              <span className="flex items-center">
                <ClockCircleOutlined className="mr-1" style={{color: "green"}}/>
                <Text type="secondary">
                  {formatTime(newsData.created_at)}
                </Text>
              </span>
              <span className="flex items-center">
                <MessageOutlined className="mr-1" style={{color: "green"}}/>
                <Text type="secondary">
                  {newsData.comments ? newsData.comments.length : 0} bình luận
                </Text>
              </span>
            </div>

            {newsData.cover && (
              <div className="mb-6 text-center">
                <Image 
                  src={newsData.cover} 
                  alt={newsData.title}
                  className="max-w-full rounded-lg"
                />
              </div>
            )}

            <div className="article-content">
              {newsData.content.map((paragraph, index) => (
                <Paragraph key={index} className="text-base leading-relaxed">
                  {paragraph}
                </Paragraph>
              ))}
            </div>
          </Card>

          {/* Phần bình luận */}
          <Card 
            variant="borderless"
            style={{ marginTop: "24px", boxShadow: "none" }}
            title={
              <Title level={4}>
                BÌNH LUẬN ({newsData.comments ? newsData.comments.length : 0})
              </Title>
            }
          >
            <List
              itemLayout="vertical"
              dataSource={newsData.comments || []}
              renderItem={(comment) => (
                <List.Item className="py-4 border-b border-gray-100">
                  <CommentItem
                    author={comment.username}
                    avatar={<UserOutlined />}
                    content={comment.content}
                    datetime={formatDateTime(comment.created_at)}
                  />
                </List.Item>
              )}
            />

            <div className="mb-4 border-[0.5px] border-gray-100"></div>

            {/* Phần nhập bình luận - đã chuyển từ form sang div */}
            <Title level={5}>VIẾT BÌNH LUẬN:</Title>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-gray-300"
                    style={{ borderRadius: 0 }}
                    placeholder="Nhập tên của bạn" 
                    value={commentUsername}
                    onChange={(e) => setCommentUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Email</label>
                  <input 
                    type="email"
                    className="w-full p-2 border border-gray-300"
                    style={{ borderRadius: 0 }} 
                    placeholder="Nhập email của bạn (không bắt buộc)" 
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Số điện thoại</label>
                  <input 
                    type="tel"
                    className="w-full p-2 border border-gray-300"
                    style={{ borderRadius: 0 }}
                    placeholder="Nhập số điện thoại của bạn (không bắt buộc)" 
                    value={commentPhone}
                    onChange={(e) => setCommentPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Bình luận <span className="text-red-500">*</span></label>
                <textarea 
                  className="w-full p-2 border border-gray-300"
                  rows={4} 
                  style={{ borderRadius: 0 }}
                  placeholder="Nhập nội dung bình luận của bạn" 
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="px-10 py-2 bg-green-500 text-white rounded-2xl border border-green-500"
                  disabled={submitting}
                  onClick={handleSubmitComment}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi'}
                </button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NewsDetails;
