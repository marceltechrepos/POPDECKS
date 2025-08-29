import React, { useState } from 'react';
import { Card, Page, Layout, Text, Badge, TextContainer } from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import { useSelector } from 'react-redux';


export default function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const store = useSelector((state) => state.store.storeDetail);

    const plans = [
        {
            id: 'starter',
            title: '💡 Starter — $798/month',
            name: store?.storeName || 'Your Store',
            price: 798,
            store_id: store?.Store_Id || 3123232,
            badge: "Few Features Included",
            description: 'Best for: Small stores or new users who want basic functionality and a lower-risk entry.',
            features: [
                '1 active upsell or cross-sell rule',
                '1 urgency widget (e.g., countdown bar or popup)',
                'Access to 1 basic bundle group',
                'Limited customization (colors, position presets only)',
                'No thank-you page features',
                'No advanced triggers (e.g., exit-intent, cart size rules)',
                'No analytics',
                'Support via email only',
            ],
            return_url:
                `https://${store?.domain}/admin/apps/5a90a5607903ebd29aa8231832e6d18a`,
        },
        {
            id: 'pro',
            title: '🏆 Pro — $1,798/month',
            name: store?.storeName || 'Your Store',
            price: 1798,
            store_id: store?.Store_Id || 3123232,
            badge: 'All Features Included',
            description: 'Best for: Growing or established stores looking for complete control and results.',
            features: [
                'Unlimited upsell & cross-sell rules',
                'All urgency widgets (countdown, scarcity, popup combos)',
                'Full bundles feature access (multiple groupings, tiered bundles)',
                'Thank-you page widget (post-purchase offers)',
                'Advanced widget triggers (scroll %, exit intent, cart total, page delay)',
                'Priority support (email + optional live chat if added later)',
                'Future features (e.g., AI behavior-driven offers) included',
            ],
            return_url:
                `https://${store?.domain}/admin/apps/5a90a5607903ebd29aa8231832e6d18a`,
        },
    ];

    const storehandle = store?.domain.split('.')[0] || 'your-store';
    return (
        <Page title="Choose Your Plan">
            <TitleBar title="Pricing" />
            <Layout>
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                        <Layout.Section oneHalf key={plan.id}>
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Card
                                    title={plan.title}
                                    sectioned
                                    style={{ flex: 1 }}
                                    primaryFooterAction={{
                                        content: isSelected ? 'Selected' : 'Choose Plan',
                                        onAction: () => window.open(`https://admin.shopify.com/store/${storehandle}/charges/popdecks/pricing_plans`, "_blank"),
                                        disabled: isSelected || isLoading,
                                    }}


                                >
                                    {plan.badge && <Badge status="success">{plan.badge}</Badge>}
                                    <TextContainer spacing="tight">
                                        <Text as="p" fontWeight="medium">
                                            {plan.description}
                                        </Text>
                                        <ul>
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </TextContainer>
                                </Card>
                            </div>
                        </Layout.Section>
                    );
                })}
            </Layout>
        </Page>
    );
}