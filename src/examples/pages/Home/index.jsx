import { Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuidePopup from '../../components/GuidePopup';

const { Title, Paragraph } = Typography;

function Home() {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <>
      <div className="home-page">
        <header>
          <Title level={1}>React Big Schedule</Title>
          <Paragraph>
            React Big Schedule is a powerful and intuitive scheduler and resource planning solution built with React.
            Seamlessly integrate this modern, browser-compatible component into your applications to effectively manage
            time, appointments, and resources. With drag-and-drop functionality, interactive UI, and granular views,
            React Big Schedule empowers you to effortlessly schedule and allocate resources with precision.
          </Paragraph>
          <Button type="link" size="large" onClick={() => navigate('/basic')}>
            Get Started
          </Button>
        </header>
      </div>

      {/* 3D Guide Popup */}
      <GuidePopup isVisible={showGuide} onClose={handleCloseGuide} />
    </>
  );
}

export default Home;
