import React from 'react';

const PaymentButton = ({ onPayment }) => {
    const fetchToken = async () => {
        try {
            const response = await fetch('https://api.phonepe.com/apis/identity-manager/v1/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: 'SU2504231251338267218682',
                    client_version: '1',
                    client_secret: '051435ce-330f-4a5c-a7c0-868d223dd99d',
                    grant_type: 'client_credentials',
                }),
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                throw new Error('Failed to fetch token');
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    const handlePayment = async () => {
        console.log('Proceeding with payment...');

        try {
            // Fetch a valid token
            const token = await fetchToken();
            if (!token) {
                console.error('Token fetch failed. Cannot proceed with payment.');
                return;
            }

            // Create the order request payload
            const orderPayload = {
                merchantOrderId: "hhhhhh",
                amount: 100, // Amount in smallest currency unit (e.g., cents or paise)
                expireAfter: 1200, // Expiry time in seconds
                metaInfo: {
                    udf1: "test1",
                    udf2: "new param2",
                    udf3: "test3",
                    udf4: "dummy value 4",
                    udf5: "addition infor ref1",
                },
                paymentFlow: {
                    type: "PG_CHECKOUT",
                    message: "Payment message used for collect requests",
                    merchantUrls: {
                        redirectUrl: "https://google.com",
                    },
                },
            };

            // Simulate a POST request to your payment service
            const response = await fetch('https://api.phonepe.com/apis/pg/checkout/v2/pay ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `O-Bearer ${token}`, // Use the fetched token here
                },
                body: JSON.stringify(orderPayload), // Include the order payload
            });

            console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const result = await response.json();
            console.log('Payment successful:', result);

            // Trigger the onPayment callback if provided
            if (onPayment) {
                onPayment(result);
            }

            // Open the redirect URL
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl; // Navigate to the redirect URL
            } else {
                console.error('Redirect URL not found in the response.');
            }
        } catch (error) {
            console.error('Error during payment:', error);
        }
    };

    return (
        <button
            onClick={handlePayment}
            style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
            }}
        >
            Buy Now
        </button>
    );
};

export default PaymentButton;
