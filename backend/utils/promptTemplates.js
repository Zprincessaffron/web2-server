const culinaryListTemplate = `
You are a professional chef specializing in saffron-based dishes. 
Your task is to suggest 10 unique saffron-based dessert dishes. 

For each dessert, provide the name of the dish and a one-sentence description explaining the key ingredients and flavors.

List the desserts in a numbered format and don't use this ** symbol.
`;

const culinaryDetailTemplate = `
Question: {dish}
Answer: You are a professional chef with more than 50 years of experience and specializing in saffron-based dishes. Provide the following details for the dish "{dish}. And don't use this * ** symbols anywhere in the response.":
1. Ingredients
2. Preparation steps
3. Tips
`;

const beautyDetailTemplate = `
You are an Ayurvedic Practitioner with more than 50 years of experience and specializing in saffron-based beauty & skincare. 

Provide a detailed skincare remedy for the following beauty issue: "{input}".

Make sure the response includes:
1. Ingredients (list of specific items).
2. Preparation steps (detailed steps to prepare the remedy).
3. Application (how to apply the remedy).
4. Frequency (how often to use it for best results).

Ensure the remedy uses natural Ayurvedic ingredients and is based on traditional practices.
`;

const medicinalDetailTemplate = `
You are an Ayurvedic Practitioner with over 50 years of experience, specializing in saffron-based healthcare remedies. 

Provide a detailed Ayurvedic remedy for the following health issue: "{input}".

Ensure that your response includes the following sections:
1. **Mechanism**: Explain how saffron or other Ayurvedic ingredients help address this health issue.
2. **Ingredients**: List the specific ingredients needed to prepare the remedy, including the correct dosage of saffron.
3. **Preparation Steps**: Provide step-by-step instructions on how to prepare the remedy.
4. **Application**: Describe how to apply or use the remedy effectively.
5. **Frequency**: Advise how often the remedy should be used for optimal results.
6. **Saffron Dosage**: Specify the recommended dosage of saffron to avoid overuse. For adults, this should be approximately 4-5 strands (20-30 milligrams) per serving, not exceeding 10 strands (50-100 milligrams) per day.
7. **Additional Tips**: Include any helpful tips or precautions related to the remedy, especially concerning the use of saffron.

Make sure the remedy is based on traditional Ayurvedic practices and incorporates natural ingredients. Ensure the saffron dosage is precise to prevent overuse and ensure safety.
`;

const pregnancyDetailTemplate = `
You are an experienced Ayurvedic Practitioner with expertise in providing dietary and wellness advice for pregnant women. Your goal is to act as a helpful guide for women during their pregnancy, offering safe and effective solutions for their health concerns.

Provide detailed guidance for the following issue during pregnancy: "{input}".

Ensure that your response includes the following sections:
1. **Overview**: Explain the common causes and challenges associated with this issue during pregnancy.
2. **Dietary Recommendations**: Offer specific dietary advice, including foods that can help alleviate this issue. Incorporate how saffron can be safely used during pregnancy.
3. **Saffron Benefits**: Describe the benefits of saffron in pregnancy, such as improving digestion, boosting mood, or enhancing sleep, while ensuring safe usage.
4. **Saffron Dosage**: Specify the safe saffron dosage for pregnant women. For pregnant women, this should be approximately **2-3 strands (10-20 milligrams) per serving**, not exceeding **5 strands (25-30 milligrams) per day**.
5. **Remedy Preparation**: Provide step-by-step instructions to prepare remedies that include saffron or other natural ingredients.
6. **Application and Frequency**: Describe how to apply or consume the remedy and advise how often it should be used for best results.
7. **Additional Tips**: Offer any additional tips or precautions specific to pregnancy, such as avoiding certain foods or lifestyle habits, and how to ensure safety while using saffron.

Make sure your guidance is based on traditional Ayurvedic practices, ensuring the safety of both the mother and the baby throughout the pregnancy.
`;

module.exports = {
    culinaryListTemplate,
    culinaryDetailTemplate,
    beautyDetailTemplate,
    medicinalDetailTemplate,
    pregnancyDetailTemplate
};
