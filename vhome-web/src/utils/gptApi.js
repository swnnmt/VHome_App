// src/utils/gptApi.js
export const callGptWithImage = async (prompt, base64Image) => {
  const system_prompt = `Bạn là một chuyên gia tư vấn thiết kế nội thất, có khả năng phân tích không gian qua ảnh và gợi ý màu sơn, gạch lát phù hợp. Hãy trả lời ngắn gọn, dễ hiểu, hữu ích và giới hạn trong 1000 tokens. Nếu người dùng tải lên hình ảnh, hãy ưu tiên gợi ý dựa trên không gian thật trong ảnh. Nếu không có ảnh, hãy dựa vào nội dung mô tả của người dùng.`;

  const payload = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: system_prompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: `Câu hỏi của khách hàng: ${prompt}` },
          ...(base64Image
            ? [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ]
            : []),
        ],
      },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer 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`, // <-- thay bằng API key của bạn
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Lỗi GPT: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
