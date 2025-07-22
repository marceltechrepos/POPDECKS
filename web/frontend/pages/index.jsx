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
            <Stack vertical spacing="tight">
              <Heading element="h1">Pop Deck</Heading>
              <Text variant="bodyMd" as="p">
                Convert Visitors. Capture Leads. All from PopDeck.
              </Text>


              <hr />
              <Heading element="h2">To apply the popup feature, please enable the extension:</Heading>
              <hr />

              <Stack vertical spacing="loose">
                <Text as="p">1. Go to <strong>Online Store</strong> in your Shopify Admin Panel.</Text>
                <Text as="p">2. Click <strong>Customize</strong> next to your active theme.</Text>
                <Text as="p">3. In the theme editor, click the <strong>App embeds</strong> (⚙️ icon or left sidebar).</Text>
                <Text as="p">4. Find and enable the <strong>PopDeck</strong> extension toggle.</Text>
                <Text as="p">5. Click <strong>Save</strong> in the top-right corner.</Text>
              </Stack>
            </Stack>
          </Card>
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