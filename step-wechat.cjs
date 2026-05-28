/**
  * 
 * 使用新的自动等待和日志功能
 */

// 加载 .env 文件中的环境变量
require('dotenv').config();

const { SDK, DEFAULTS } = require('element-selector-sdk-nodejs');
const { generateLLMComment } = require('./llm.cjs');

DEFAULTS.scrollToVisible.scrollDelta = 3;

async function debugWechat() {
    console.log('=== 微信应用调试工具（优化版）===\n');

    // 配置自动等待、日志和 idle 默认值
    const sdk = new SDK({
        baseUrl: 'http://localhost:8080',
    });

    const flow = sdk.flow();



    try {

       
        // 激活窗口
        await flow.window({ title: `微信`, className: `Chrome_WidgetWin_0`, processName: `WeChatAppEx` });

        console.log("滚动到写留言出现")
        // await flow.scrollDown(`/Document`, { wait: `/Document/Text[@Name='写留言']` });
        await flow.scrollToVisible(`/Document/Text[@Name='写留言']`, `/Document`);

        // // // 文章标题列表 /Document[starts-with(@ClassName, 'Chrome_RenderWidgetHost') and @FrameworkId='Chrome']/Group[@FrameworkId='Chrome']/Button[@FrameworkId='Chrome']/ListItem[@FrameworkId='Chrome']

        // let articles = await flow.findAll(`/Document[starts-with(@ClassName, 'Chrome_RenderWidgetHost') and @FrameworkId='Chrome']/Group[@FrameworkId='Chrome' and @LocalizedControlType='主要']/Button[@FrameworkId='Chrome']`);

        // console.log("Found", articles.length, "articles.");

        // let article = articles[0];
        // console.log(await article.checkVisibility())
        // console.log("Scrolling to article 5", article.toXpath());
        // await article.scrollIntoView(`/Document`,{scrollToCenter: true,direction: 'down', autoDelta: true });
        // console.log("Article 5 scrolled into view");
        // console.log(await article.checkVisibility())
        // await article.flash()
        // await article.click({flash: true});
        // console.log(article);
        // console.log(articles.length);

      
        
        console.log('\n✓ 所有操作完成!');
    } catch (error) {
        console.error('\n❌ 发生错误');
        if (error instanceof Error) {
            console.error(`   错误类型: ${error.constructor.name}`);
            console.error(`   错误消息: ${error.message}`);

            // 提供更详细的网络错误信息
            if (error.constructor.name === 'AxiosError') {
                const axiosError = error;
                if (!axiosError.response) {
                    console.error('\n💡 可能的原因:');
                    console.error('   • 后端服务未启动');
                    console.error('   • 网络连接失败');
                    console.error('   • 端口 8080 被占用');
                    console.error('\n🔧 解决方法:');
                    console.error('   1. 启动后端服务:');
                    console.error('      cd d:\\repos\\uia-project\\win-element-selector-rs');
                    console.error('      cargo run --bin element-selector-server');
                    console.error('   2. 确认服务启动成功后再运行此脚本');
                    console.error('   3. 访问 http://localhost:8080/api/health 检查服务状态');
                } else {
                    console.error(`   HTTP 状态码: ${axiosError.response.status}`);
                    console.error(`   响应数据:`, axiosError.response.data);
                }
            }
        }

    } finally {
        // 在后台启动 idle 移动
        console.log('\n🖱️ 正在停止 idle 移动，请稍候...');
        await flow.stopIdle();

    }
}

debugWechat();
