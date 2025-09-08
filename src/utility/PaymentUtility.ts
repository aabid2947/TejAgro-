import { initializeEasebuzzCheckout } from 'react-native-easebuzz-sdk';

/**
 * Defines the structure of the detailed payment object returned by Easebuzz on success or failure.
 */
export interface EasebuzzPaymentDetails {
    txnid: string;
    status: string;
    amount: string;
    email: string;
    firstname: string;
    productinfo: string;
    easepayid: string;
    phone: string;
    error_Message?: string;
    hash:string // Captures the error message from the bank/gateway
    // Add any other fields you might need from the response
}

/**
 * Defines the standardized result object returned by our utility functions.
 */
export interface PaymentResult {
    success: boolean;
    result: string;
    payment_response?: EasebuzzPaymentDetails;
    error?: string;
}

/**
 * Processes a payment using the Easebuzz SDK.
 * This function wraps the native SDK call, handling various success and failure states.
 * @param accessKey The unique transaction access key from your backend.
 * @param payMode The environment mode, either "test" or "production".
 * @returns A promise that resolves to a standardized PaymentResult object.
 */
export const processEasebuzzPayment = async (
    accessKey: string, 
    payMode: string = "test"
): Promise<PaymentResult> => {
    try {
        console.log("Initiating Easebuzz payment with accessKey:", accessKey, "payMode:", payMode);
        
        // Call the Easebuzz SDK
        let response = await initializeEasebuzzCheckout(accessKey, payMode);
        
        console.log("Easebuzz Payment Response:", response);
        console.log(typeof(response))
        if (typeof response === 'string') {
    try {
        response = JSON.parse(response);
    } catch (error) {
        console.error("Error parsing Easebuzz response:", error);
        return {
            success: false,
            result: "parse_error",
            error: "Invalid response format from SDK"
        };
    }
}
        const paymentDetails = response.response as EasebuzzPaymentDetails;

        // Handle different payment results using the 'result' key
        switch (response.result) {
            case "payment_successfull":
                return {
                    success: true,
                    result: response.result,
                    payment_response: paymentDetails
                };
                
            // Group all failure/cancellation cases
            case "payment_failed":
            case "txn_session_timeout":
            case "user_cancelled":
            case "back_pressed":
            case "error_server_error":
            case "error_noretry":
            case "invalid_input_data":
            case "retry_fail_error":
            case "trxn_not_allowed":
            case "bank_back_pressed":
                // **UPDATE**: Prioritize the specific error message from the gateway if it exists.
                const detailedError = paymentDetails?.error_Message || getFriendlyErrorMessage(response.result);
                return {
                    success: false,
                    result: response.result,
                    payment_response: paymentDetails,
                    error: detailedError
                };
                
            default:
                // Handle any unknown results from the SDK
                return {
                    success: false,
                    result: response.result || "unknown",
                    error: "An unknown payment result occurred."
                };
        }
        
    } catch (error: any) {
        console.error("Payment Processing Error:", error);
        return {
            success: false,
            result: "sdk_error",
            error: error.message || "A fatal error occurred during payment processing."
        };
    }
};

/**
 * Provides a user-friendly error message for known non-successful payment results.
 * @param result The result string from the Easebuzz SDK.
 * @returns A user-friendly error message.
 */
const getFriendlyErrorMessage = (result: string): string => {
    const errorMessages: { [key: string]: string } = {
        "payment_failed": "Payment failed from the bank's side. Please try another payment method.",
        "txn_session_timeout": "The transaction session timed out. Please try again.",
        "user_cancelled": "Payment was cancelled.",
        "back_pressed": "Payment was cancelled.",
        "error_server_error": "A server error occurred during payment. Please try again later.",
        "error_noretry": "This payment failed and cannot be retried.",
        "invalid_input_data": "Invalid payment data was provided.",
        "retry_fail_error": "The payment retry attempt failed.",
        "trxn_not_allowed": "This transaction is not allowed.",
        "bank_back_pressed": "Payment was cancelled on the bank page."
    };
    return errorMessages[result] || "Payment failed due to an unknown reason.";
};

/**
 * Safely parses the payment_response string into a JSON object.
 * @param paymentResponse A JSON string.
 * @returns A parsed object or null if parsing fails.
 */
export const parsePaymentResponse = (paymentResponse: string) => {
    if (!paymentResponse || typeof paymentResponse !== 'string') {
        return null;
    }
    try {
        return JSON.parse(paymentResponse);
    } catch (error) {
        console.error("Error parsing payment response string:", error);
        return null;
    }
};