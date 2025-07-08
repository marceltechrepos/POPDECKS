import {
  Page,
  Layout,
  Card,
  Heading,
  TextContainer,
  Text,
  Stack,
  Badge,
  Icon,
  CalloutCard,
  Button
} from '@shopify/polaris';
import { ProductsMajor, ConfettiMajor, EmailMajor, AutomationMajor } from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast'

function Index() {
  const Store = useSelector((state) => state.store.storeDetail);
  console.log("Store", Store);
  const app = useAppBridge();
  const navigate = useNavigate();
  const handleEnableExtension = () => {
    if (app) {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.ADMIN_PATH,
        '/extensions/enable'
      );
    } else {
      window.location.href = '/admin/extensions/enable';
    }
  };

  return (
    <Page fullWidth title="OptiStep Dashboard">
      <Layout>
        {/* Full-width Header Section */}
        <Layout.Section>
          <Card sectioned>
            <Stack vertical>
              <Heading element="h1">OptiStep</Heading>
              <Text variant="bodyMd" as="p">
                Boost conversions with AI-powered upsells, cross-sells, and customer engagement tools
              </Text>
              <Heading element="h3">Enable the extension</Heading>
              <Button
                variant="primary"
                onClick={handleEnableExtension}
              >
                Click to enable Extension
              </Button>
            </Stack>
          </Card>
        </Layout.Section>

        {/* First Row - Two Cards */}
        <Layout.Section>
          <Layout>
            <Layout.Section oneHalf>
              <Card title="Upsell & Cross-sell Engine" sectioned>
                <Stack vertical spacing="tight">
                  <Icon source={ProductsMajor} color="primary" />
                  <TextContainer>
                    <Text variant="bodyMd" as="p">
                      <Badge status="success">Live</Badge> Display relevant offers based on:
                    </Text>
                    <ul>
                      <li>Cart contents</li>
                      <li>Product tags</li>
                      <li>Collections</li>
                    </ul>
                  </TextContainer>
                  <CalloutCard
                    title="Key Features"
                    illustration=""
                    primaryAction={{
                      content: 'Configure offers',
                      url: '/offers'
                    }}
                  >
                    <Stack vertical>
                      <Text as="p">• AJAX-based "Add to Cart"</Text>
                      <Text as="p">• "Skip this offer" option</Text>
                      <Text as="p">• Conversion analytics</Text>
                    </Stack>
                  </CalloutCard>
                </Stack>
              </Card>
            </Layout.Section>

            <Layout.Section oneHalf>
              <Card title="Thank-You Page Enhancer" sectioned>
                <Stack vertical spacing="tight">
                  <Icon source={ConfettiMajor} color="primary" />
                  <TextContainer>
                    <Text variant="bodyMd" as="p">
                      <Badge status="success">Live</Badge> Post-purchase features:
                    </Text>
                  </TextContainer>
                  <CalloutCard
                    title="Key Features"
                    illustration=""
                    primaryAction={{
                      content: 'Customize pages',
                      url: '/thankyou'
                    }}
                  >
                    <Stack vertical>
                      <Text as="p">• Product recommendations</Text>
                      <Text as="p">• Discount coupons</Text>
                      <Text as="p">• Social sharing</Text>
                      <Text as="p">• Upsell tracking</Text>
                    </Stack>
                  </CalloutCard>
                </Stack>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>

        {/* Second Row - Two Cards */}
        <Layout.Section>
          <Layout>
            <Layout.Section oneHalf>
              <Card title="Opt-in Capture Tools" sectioned>
                <Stack vertical spacing="tight">
                  <Icon source={EmailMajor} color="primary" />
                  <TextContainer>
                    <Text variant="bodyMd" as="p">
                      <Badge status="success">Live</Badge> Convert visitors to subscribers:
                    </Text>
                  </TextContainer>
                  <CalloutCard
                    title="Key Features"
                    illustration=""
                    primaryAction={{
                      content: 'Setup popups',
                      onAction: () => { navigate('/popups') }
                    }}
                  >
                    <Stack vertical>
                      <Text as="p">• Time delay triggers</Text>
                      <Text as="p">• Scroll percentage</Text>
                      <Text as="p">• Exit intent detection</Text>
                    </Stack>
                  </CalloutCard>
                </Stack>
              </Card>
            </Layout.Section>

            {/* Add another feature card here if needed */}
            {/* <Layout.Section oneHalf>
              <Card title="Another Feature" sectioned>
                ...
              </Card>
            </Layout.Section> */}
          </Layout>
        </Layout.Section>
      </Layout>
      <Toaster 
        position='top-right'
      />
    </Page>
  );
}

export default Index;