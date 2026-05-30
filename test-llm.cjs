// 测试 LLM API 连接
require('dotenv').config();
const { generateLLMComment } = require('./llm.cjs');

async function testAPI() {
    console.log('=== 测试 LLM API 连接 ===\n');
    console.log('环境变量:');
    console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '已设置 (' + process.env.OPENAI_API_KEY.substring(0, 10) + '...)' : '未设置');
    console.log('  OPENAI_MODEL:', process.env.OPENAI_MODEL || 'auto');
    console.log('  OPENAI_BASE_URL:', process.env.OPENAI_BASE_URL || 'https://lmproxy.yiq.pub/openai/v1');
    console.log();

    try {
        const comment = await generateLLMComment({
            articleTitle: '测试文章标题'
        });
        console.log('\n✓ 测试成功！');
        console.log('生成的评论:', comment);
    } catch (error) {
        console.error('\n❌ 测试失败');
        console.error('请检查:');
        console.error('  1. API Key 是否正确');
        console.error('  2. API 服务是否可用');
        console.error('  3. 网络连接是否正常');
        console.error('  4. 是否需要更换代理或 API 提供商');
    }
}

testAPI();
