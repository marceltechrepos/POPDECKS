import shopify from "../shopify.js";

export const getBillingDetail = async (req, res) => {
  try {
    const session = res.locals.shopify.session;

    if (!session) {
      return res.status(401).json({ message: "Unauthorized: No Shopify session found" });
    }

    const client = new shopify.api.clients.Graphql({ session });

    const query = `
      query {
        currentAppInstallation {
          activeSubscriptions {
            name
            status
            lineItems {
              plan {
                pricingDetails {
                  __typename
                  ... on AppRecurringPricing {
                    price {
                      amount
                      currencyCode
                    }
                    interval
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await client.query({ data: query });

    const subscriptions = response.body?.data?.currentAppInstallation?.activeSubscriptions || [];

    // Return the billing/subscription data
    return res.status(200).json({
      subscriptions,
      message: subscriptions.length > 0 ? "Active subscription found" : "No active subscriptions",
    });

  } catch (error) {
    console.error("Error fetching billing details:", error);
    return res.status(500).json({ message: "Failed to fetch billing details" });
  }
};