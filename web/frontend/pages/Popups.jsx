import React, { useEffect, useState } from 'react';
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  ChoiceList,
  Checkbox,
  RangeSlider,
  Button,
  Banner,
  Badge,
  Stack,
  Heading,
  TextContainer,
  Text,
  Icon,
  DropZone,
  Thumbnail
} from '@shopify/polaris';
import { MobileCancelMajor, EmailMajor, MobileMajor, DiscountsMajor, ImageMajor } from '@shopify/polaris-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

function Popups() {
  // Form state
  const [popupTitle, setPopupTitle] = useState('Stay tuned!');
  const [popupContent, setPopupContent] = useState('Stay updated!');
  const [ctaText, setCtaText] = useState('Subscribe');
  const [triggerType, setTriggerType] = useState(['time-delay']);
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [scrollPercentage, setScrollPercentage] = useState(50);
  const [collectEmail, setCollectEmail] = useState(true);
  const [collectSMS, setCollectSMS] = useState(false);
  const [activePreview, setActivePreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exitIntentActive, setExitIntentActive] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const store = useSelector((state) => state.store.storeDetail);

  // Handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title", popupTitle);
    formData.append("Content", popupContent);
    formData.append("storeId", store.Store_Id); // Replace appropriately
    formData.append("storeName", store.storeName);
    formData.append("collectEmail", collectEmail);
    formData.append("collectSMS", collectSMS);
    formData.append("delaySeconds", triggerType.includes('time-delay') ? delaySeconds : 0);
    formData.append("scrollPercentage", triggerType.includes('scroll-percentage') ? scrollPercentage : 0);
    formData.append("ctaText", ctaText);
    formData.append("exitIntent", triggerType.includes('exit-intent') ? exitIntentActive : false);

    if (image) {
      formData.append("Image", image); // this should be a File object from DropZone
    }

    try {
      const response = await fetch("/api/create-popup", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      console.log("✅ Popup saved:", result);
    } catch (error) {
      alert("❌ Failed to save popup:", error);
    }
  };

  const getPopup = async () => {
    try {
      const storeName = store.storeName; // Make sure this is defined

      const response = await fetch(`/api/get-popup?storeName=${encodeURIComponent(storeName)}`, {
        method: "GET",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      console.log("✅ Popup fetched:", result);
    } catch (error) {
      alert("❌ Failed to fetch popup:", error);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
    setActivePreview(!showPreview);
  };

  // Handle image upload
  const handleImageDrop = (files, acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImage(null);
    setImageUrl('');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  // Preview popup component - HORIZONTAL RECTANGULAR DESIGN
  const PreviewPopup = () => (
    <div style={{
      position: showPreview ? 'fixed' : 'relative',
      top: '50%',
      left: '50%',
      transform: showPreview ? 'translate(-50%, -50%)' : 'none',
      width: '90%',
      maxWidth: '700px', // Wider for horizontal layout
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: showPreview ? '0 10px 30px rgba(0,0,0,0.3)' : 'none',
      zIndex: showPreview ? '1000' : 'auto',
      border: '1px solid #ddd',
      margin: showPreview ? '0' : '20px 0',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '20px'
    }}>
      {/* Image section (left) */}
      {imageUrl && (
        <div style={{
          flex: '0 0 40%',
          minHeight: '200px',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f8f8f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={imageUrl}
            alt="Popup visual"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Content section (right) */}
      <div style={{
        flex: '1',
        position: 'relative',
        minHeight: '200px'
      }}>
        <div style={{ position: 'absolute', top: '0', right: '0' }}>
          <Button plain onClick={() => togglePreview()}>
            <Icon source={MobileCancelMajor} />
          </Button>
        </div>

        <Stack vertical spacing="tight">
          <TextContainer>
            <Heading>{popupTitle}</Heading>
            <Text as="p" color="subdued">{popupContent}</Text>
          </TextContainer>

          <div style={{ margin: '20px 0' }}>
            {collectEmail && (
              <TextField
                label="Email"
                placeholder="your@email.com"
                prefix={<Icon source={EmailMajor} color="subdued" />}
              />
            )}

            {collectSMS && (
              <TextField
                label="Phone"
                placeholder="(123) 456-7890"
                prefix={<Icon source={MobileMajor} color="subdued" />}
              />
            )}
          </div>

          <Button fullWidth primary>
            {ctaText}
          </Button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button plain>No thanks</Button>
          </div>
        </Stack>
      </div>
    </div>
  );

  useEffect(() => {
    getPopup();
  }, []);
  return (
    <Page
      title="Opt-in Capture Tools"
      subtitle="Convert visitors to subscribers with targeted popups"
      primaryAction={{ content: 'Save Configuration', onAction: handleSubmit }}
      secondaryActions={[
        {
          content: activePreview ? 'Close Preview' : 'Preview Popup',
          onAction: togglePreview
        }
      ]}
    >
      <Layout>
        {showPreview && (
          <Layout.Section>
            <PreviewPopup />
          </Layout.Section>
        )}

        <Layout.Section>
          <Banner status="info">
            <p>Configure popups to capture leads at strategic moments with exit intent, scroll triggers, or timed displays.</p>
          </Banner>
        </Layout.Section>

        <Layout.Section oneHalf>
          <Card title="Popup Content">
            <Card.Section>
              <FormLayout>
                <TextField
                  label="Popup Title"
                  value={popupTitle}
                  onChange={setPopupTitle}
                  autoComplete="off"
                />

                <TextField
                  label="Content"
                  value={popupContent}
                  onChange={setPopupContent}
                  multiline={4}
                  autoComplete="off"
                />

                <TextField
                  label="Button Text"
                  value={ctaText}
                  onChange={setCtaText}
                  autoComplete="off"
                  prefix={<Icon source={DiscountsMajor} color="subdued" />}
                />
              </FormLayout>
            </Card.Section>

            <Card.Section title="Popup Image">
              {imageUrl ? (
                <Stack vertical spacing="tight">
                  <Thumbnail
                    source={imageUrl}
                    alt="Popup image preview"
                    size="large"
                  />
                  <Button onClick={removeImage}>Remove Image</Button>
                </Stack>
              ) : (
                <DropZone
                  accept="image/*"
                  type="image"
                  onDrop={handleImageDrop}
                >
                  <DropZone.FileUpload
                    actionHint="Accepts JPG, PNG, GIF up to 10MB"
                    actionTitle="Upload Image"
                    icon={ImageMajor}
                  />
                </DropZone>
              )}
            </Card.Section>
          </Card>

          <Card title="Data Collection">
            <Card.Section>
              <FormLayout>
                <Checkbox
                  label="Collect email addresses"
                  checked={collectEmail}
                  onChange={setCollectEmail}
                />
                <Checkbox
                  label="Collect phone numbers for SMS"
                  checked={collectSMS}
                  onChange={setCollectSMS}
                />
              </FormLayout>
            </Card.Section>
          </Card>
        </Layout.Section>

        <Layout.Section oneHalf>
          <Card title="Trigger Settings">
            <Card.Section>
              <FormLayout>
                <ChoiceList
                  title="Activate when"
                  choices={[
                    { label: 'Time delay', value: 'time-delay' },
                    { label: 'Scroll percentage', value: 'scroll-percentage' },
                    { label: 'Exit intent', value: 'exit-intent' },
                  ]}
                  selected={triggerType}
                  onChange={setTriggerType}
                  allowMultiple
                />

                {triggerType.includes('time-delay') && (
                  <RangeSlider
                    label="Delay time (seconds)"
                    value={delaySeconds}
                    onChange={setDelaySeconds}
                    min={10}
                    max={100}
                    step={5}
                    output
                  />
                )}

                {triggerType.includes('scroll-percentage') && (
                  <RangeSlider
                    label="Scroll depth (%)"
                    value={scrollPercentage}
                    onChange={setScrollPercentage}
                    min={100}
                    max={1000}
                    step={50}
                    output
                  />
                )}

                {triggerType.includes('exit-intent') && (
                  <Checkbox
                    label="Enable exit intent detection"
                    checked={exitIntentActive}
                    onChange={setExitIntentActive}
                  />
                )}
              </FormLayout>
            </Card.Section>
          </Card>

          <Card>
            <Card.Section>
              <Stack vertical spacing="tight">
                <Heading>Preview</Heading>
                <Text as="p" color="subdued">See how your popup will appear to visitors</Text>
                <Button onClick={togglePreview}>
                  {activePreview ? 'Close Preview' : 'Show Preview'}
                </Button>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card title="Trigger Status">
            <Card.Section>
              <Stack distribution="fill">
                <Badge status={triggerType.includes('time-delay') ? 'success' : 'attention'}>
                  Time Delay {triggerType.includes('time-delay') ? 'Active' : 'Inactive'}
                </Badge>
                <Badge status={triggerType.includes('scroll-percentage') ? 'success' : 'attention'}>
                  Scroll Trigger {triggerType.includes('scroll-percentage') ? 'Active' : 'Inactive'}
                </Badge>
                <Badge status={triggerType.includes('exit-intent') && exitIntentActive ? 'success' : 'attention'}>
                  Exit Intent {triggerType.includes('exit-intent') && exitIntentActive ? 'Active' : 'Inactive'}
                </Badge>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
      <Toaster
        position='top-right'
      />
    </Page>
  );
}

export default Popups;