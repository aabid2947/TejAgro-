// Test script to verify how the referral API response is parsed and displayed
// cal usig axios
import axios from 'axios';
const resposne = axios.get('https://tejagrosales.tejgroup.in/Webservices/referral-code.php', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': ' Bearer  eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJpYXQiOjE3NzEzOTYxOTIsImF1ZCI6Im15dXNlcnMiLCJkYXRhIjp7ImNsaWVudF9pZCI6IjU3NDIxNyIsImNsaWVudF9uYW1lIjoiIiwiZmlyc3RfbmFtZSI6IiIsIm1pZGRsZV9uYW1lIjoiIiwibGFzdF9uYW1lIjoiIiwiY2xpZW50X2NhdGVnb3J5IjoiUmF3IiwicmVnaXN0ZXJfZGF0ZSI6IjIwMjYtMDEtMjggMTM6MDc6MDEiLCJmaXJtX25hbWUiOm51bGwsImNsaWVudF9idXNpbmVzcyI6IiIsImNoYWx1X3BlZWsiOm51bGwsInBlZWsiOm51bGwsInN0YXRlX2lkIjpudWxsLCJ2aWxsYWdlX2lkIjoiMCIsInBvc3QiOiIiLCJsYW5kbWFyayI6IiIsInBpbmNvZGUiOiIwIiwidGFsdWthX2lkIjoiMCIsImNsaWVudF9hZGQiOiIiLCJ3b3JrX2FkZHJlc3MiOm51bGwsImNsaWVudF9lbWFpbCI6IiIsImNsaWVudF9lbWFpbDIiOm51bGwsImNsaWVudF9tb2IiOiI5MDIxMDg2NTcwIiwiY2xpZW50X3BlcnNvbjEiOm51bGwsImNsaWVudF9wZXJzb24xX21vYiI6bnVsbCwiY2xpZW50X3BlcnNvbjIiOm51bGwsImNsaWVudF9wZXJzb24yX21vYjIiOm51bGwsImxhbmRsaW5lIjpudWxsLCJ3YXRlcl9hdmFpbGFiaWxpdHkiOm51bGwsImlycmlnYXRpb24iOm51bGwsImZheCI6bnVsbCwiY2xpZW50X3JlcXVpcmVkX2RldGFpbHMiOm51bGwsImJ1c2luZXNzX3R5cGUiOm51bGwsImN1cnJlbnRfc3RhdHVzIjpudWxsLCJjbGllbnRfc3RyZW5ndGgiOm51bGwsInVzZXJfaWQiOiIwIiwiYnJhbmNoX2lkIjoiMCIsImRlcHRfaWQiOiIwIiwiY2xpZW50X3N0YXR1cyI6IiIsInNvd2luZ19kYXRlIjpudWxsLCJmaXJzdF9vcmRlcl9kYXRlIjpudWxsLCJpbXBvcnQiOm51bGwsImZpcnN0X3Zpc2l0X2lkIjoiMCIsInZpc2l0X2lkIjoiMjE2NzY3MCIsImVucV90eXBlIjoiT3duIFNvdXJjZSIsInJlZmVyZW5jZV9ubyI6IjE3Njk1ODU4MjEiLCJyZWZlcmVuY2VfYnkiOiJNYW51YWwiLCJjcm9wX2lkcyI6IiIsIkdvbGQiOiJOIiwiS3J1c2hpUmF0bmEiOiJOIiwicG9zdF9vZmZpY2UiOm51bGwsInZpc2l0X2RhdGUiOiIyMDI2LTAxLTI4IiwidmlzaXRfdGltZSI6IjE4OjAwOjEzIiwidmlzaXRfdHlwZSI6bnVsbCwidmlzaXRfdXNlcl9pZCI6IjExMzMiLCJjbGllbnRfZmVlZGJhY2siOiJuYyIsIm5leHRfZm9sbG91cF9kYXRlIjoiMjAyNi0wMS0yOCIsIm5leHRfZm9sbG93dXBfdGltZSI6IiIsInN0YXR1cyI6Ik5vdCBDb25uZWN0ZWQiLCJwcm9kdWN0X2lkcyI6Int9IiwibGFuZF9ob2xkaW5nIjpudWxsLCJzYWxlc191c2VyX2lkIjpudWxsLCJsZWFkX3NvdXJjZV9pZCI6bnVsbCwid2hhdHNhcHBfY2hlY2tib3giOm51bGwsImFsdGVybmF0ZV93aGF0c2FwcF9jaGVja2JveCI6bnVsbCwiYWx0ZXJuYXRlX3doYXRzYXBwX2NoZWNrYm94XzIiOm51bGwsIndmaF9zd2l0Y2giOiIxIiwiYXBwX2luc3RhbGxhdGlvbiI6IjEiLCJvdHAiOiI1MTc1IiwiY2xpZW50X2ltYWdlIjoiIiwicmVmZXJyYWxfY29kZSI6IjEwMjEiLCJmY21fdG9rZW4iOiJlckNtTXhwelJPV2x5MEJvYzBodU5MOkFQQTkxYkdDTlRWUFozdUtFaGNfUV8xdGdhbzZneFhaV2Rjai13cUZDSlhOZDBfZHdlWEd4OFV2NVl4Nnk2NzRuWnhrREJCQVp4Q3ZwVE82Si1NNHdldjFLc0toaHB1b2pvV3JyYlc0Rnhla29tM1h3eGM4ck1vIiwidXBkYXRlZF9hdCI6IjIwMjYtMDEtMzEgMTg6MTk6NDgifX0.cyYYaVbvI4Fn3QNneGuX5JwfbZMRZ2a3ANnT8xSBbW_BdIia7Ezi8YPjTRdWeMf7VBMjIeaDP9usNE8GeJV7hQ'
    }
}).then(response => {
    console.log("API Response received successfully."); 
    console.log("Raw response.data:", JSON.stringify(response.data, null, 2));
    // Simulate the parsing logic from ReferEarnScreen.tsx (lines 60-84)
    let parsedData = { status: false }; 
    if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("✓ Response is an array, taking first item");
        parsedData = response.data[0];
    }
    else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.log("✓ Response is an object (not array)");
        parsedData = response.data;
    }   
    else if (typeof response.data === 'string') {
        console.log("✓ Response is a string, attempting to parse");        
        try {
            const jsonData = JSON.parse(response.data);     
            if (Array.isArray(jsonData) && jsonData.length > 0) {
                parsedData = jsonData[0];
            }   
            else {
                parsedData = jsonData;
            }   
        } catch (parseError) {  
            console.error('Error parsing JSON string:', parseError);    
        }
    }
    else {
        console.log("✓ Using response.data directly");
        parsedData = response.data;
    }
    console.log("\nParsed Data:", JSON.stringify(parsedData, null, 2));
}
).catch(error => {
    console.error("Error fetching referral data:", error);
}
);


// // Simulating the axios response structure
// const mockAxiosResponse = {
//     data: {"status":true,"referral_type":"Child_Reference","farmer_name":"","referral_from":"575032","referral_to":"574217","referral_amt":"0","referral_url":"ggfghfhhfufhfhjhjdfyhudfnjfhudyfhufugdfuyyf","referral_code":"1021","referral_count":"3"}
// };

// console.log("===== REFERRAL API RESPONSE TEST =====\n");
// console.log("Raw response.data:", JSON.stringify(mockAxiosResponse.data, null, 2));
// console.log("\n");

// // Simulate the parsing logic from ReferEarnScreen.tsx (lines 60-84)
// let parsedData = { status: false };

// if (Array.isArray(mockAxiosResponse.data) && mockAxiosResponse.data.length > 0) {
//     console.log("✓ Response is an array, taking first item");
//     parsedData = mockAxiosResponse.data[0];
// } else if (typeof mockAxiosResponse.data === 'object' && !Array.isArray(mockAxiosResponse.data)) {
//     console.log("✓ Response is an object (not array)");
//     parsedData = mockAxiosResponse.data;
// } else if (typeof mockAxiosResponse.data === 'string') {
//     console.log("✓ Response is a string, attempting to parse");
//     try {
//         const jsonData = JSON.parse(mockAxiosResponse.data);
//         if (Array.isArray(jsonData) && jsonData.length > 0) {
//             parsedData = jsonData[0];
//         } else {
//             parsedData = jsonData;
//         }
//     } catch (parseError) {
//         console.error('Error parsing JSON string:', parseError);
//     }
// } else {
//     console.log("✓ Using response.data directly");
//     parsedData = mockAxiosResponse.data;
// }

// console.log("\nParsed Data:", JSON.stringify(parsedData, null, 2));
// console.log("\n===== WHAT WILL BE DISPLAYED ON SCREEN =====\n");

// // Simulate what will be displayed (from the render methods)
// const displayData = {
//     "Referral Code": parsedData?.referral_code || 'Not Available',
//     "Referral Count": parsedData?.referral_count || '0',
//     "Referral Amount": parsedData?.referral_amt || '0',
//     "Referral Type": parsedData?.referral_type || 'Standard',
//     "Farmer Name": parsedData?.farmer_name || 'N/A',
//     "Status": parsedData?.status ? 'Active' : 'Inactive'
// };

// console.log("📱 Display Values:");
// console.log("─".repeat(50));
// Object.entries(displayData).forEach(([key, value]) => {
//     console.log(`${key.padEnd(20)}: ${value}`);
// });
// console.log("─".repeat(50));

// console.log("\n===== UI COMPONENT VALUES =====\n");
// console.log("🔹 Total Referrals Box:");
// console.log(`   Count: ${parsedData?.referral_count || '0'}`);
// console.log(`   Label: "REFERRALS"`);

// console.log("\n🔹 Referral Code Section:");
// console.log(`   Code: ${parsedData?.referral_code || 'Not Available'}`);
// console.log(`   Has Copy Button: Yes`);

// console.log("\n🔹 Share Message will include:");
// console.log(`   Code: ${parsedData?.referral_code || 'Not Available'}`);

// console.log("\n✅ TEST COMPLETE\n");
