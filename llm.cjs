const https = require('https');
const http = require('http');
const url = require('url');

// 使用openai 调用LLM生成文章回复
 // 访问者默认系统提示词（阅读他人文章后评论）
const DEFAULT_VISITOR_SYSTEM_PROMPT = `你是一位热爱阅读的公众号作者，喜欢与他人交流互动。
你的公众号：[[公众号名称]]，简介：[[公众号简介]]
你的任务是：作为读者，阅读他人的文章后，结合文章标题，生成真诚、有温度的评论。
评论原则：
1. **真诚友好**：语气亲切自然，像朋友一样交流
2. **针对文章**：紧扣文章标题和主题，不要泛泛而谈
3. **有温度**：表达对作者的鼓励和认可，展现共鸣
4. **引导互动**：适当表达希望互相交流的意愿
5. **简洁精炼**：控制在 5-30 字之间，避免冗长
6. **自然得体**：保持读者视角，不要过度赞美

注意事项：
- 优先表达对文章内容的感受和共鸣
- 可以适当提出一个简短的问题引发讨论
- 避免过度营销或生硬地推广自己
- 可以适当使用表情符号增加亲和力（1个即可）

接口返回：
- **string**：生成的评论内容，不要有其他额外内容。`;

/**
 * 发送 HTTP POST 请求（底层实现，兼容各种 API 代理）
 */
function httpPost(apiUrl, headers, body) {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(apiUrl);
        const isHttps = parsedUrl.protocol === 'https:';
        const transport = isHttps ? https : http;

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.path,
            method: 'POST',
            headers: headers,
            timeout: 30000
        };

        const req = transport.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (e) {
                        reject(new Error(`解析响应失败: ${e.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });

        req.write(JSON.stringify(body));
        req.end();
    });
}

 /**
     * 生成随机评论或 LLM 评论
     * @param {Object} context - 上下文信息（可选）{ userDesc: string, articleTitle: string }
     * @returns {Promise<string>} 评论字符串
     */
 async function generateLLMComment(context){
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const apiUrl = `${baseUrl}/chat/completions`;
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    
    if (!apiKey) {
        throw new Error('请设置环境变量 OPENAI_API_KEY');
    }

    // 构建用户消息
    const userMessage = `文章标题：${context.articleTitle}\n\n请为这篇文章生成一条评论。`;

    const requestBody = {
        model: model,
        messages: [
            {
                role: 'system',
                content: DEFAULT_VISITOR_SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: userMessage
            }
        ],
        temperature: 0.7,
        max_tokens: 100,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        // 禁用推理模式，直接返回内容
        reasoning_effort: null
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    // 如果有 API Key，添加 Authorization 头
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    console.log('正在调用 LLM API...');
    console.log('模型:', model);
    console.log('API URL:', apiUrl);

    try {
        const response = await httpPost(apiUrl, headers, requestBody);
        
        const message = response.choices?.[0]?.message;
        // 优先使用 content，如果为空则使用 reasoning_content
        const comment = (message?.content || message?.reasoning_content || '').trim();
        
        if (!comment) {
            throw new Error('未能生成评论内容');
        }
        
        console.log('✓ LLM 评论生成成功');
        return comment;
    } catch (error) {
        console.error('生成评论失败:', error.message);
        
        // 提供更详细的错误信息
        if (error.message.includes('HTTP')) {
            console.error('完整错误:', error.message);
        }
        
        throw error;
    }
 }
 
 module.exports = {
     generateLLMComment
 };
 