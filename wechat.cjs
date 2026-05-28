/**
 * 元宝应用调试脚本（优化版）
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

        // // 激活窗口
        // await flow.window({ title: `微信`, className: `mmui::MainWindow`, processName: `Weixin` });

        // // ✅ 现在调用 idle() 时不需要传递配置，会使用 SDK 中设置的默认值
        // await flow.idle(`/Group[@ClassName='QWidget' and @FrameworkId='Qt']`);

        // // 查找元素
        // await flow.click(`//ToolBar[@AutomationId='MainView.main_tabbar']/Button[@Name='搜一搜']/Group/Button`);
        // await flow.wait(3000);

        // 激活窗口
        await flow.window({ title: `微信`, className: `Chrome_WidgetWin_0`, processName: `WeChatAppEx` });


        // await flow.click(`//Document/Button[@Name='文章']`);

        // await flow.idle(`//Document`);

        // await flow.type("100互助{enter}");
        // // await flow.wait(5000);

        console.log(await flow.find(`//Document/Button/Text[@Name='最新']`))

        // await flow.click(`//Document/Button/Text[@Name='最新']`);

        // // 文章标题列表 /Document[starts-with(@ClassName, 'Chrome_RenderWidgetHost') and @FrameworkId='Chrome']/Group[@FrameworkId='Chrome']/Button[@FrameworkId='Chrome']/ListItem[@FrameworkId='Chrome']

        let articles = await flow.findAll(`/Document[starts-with(@ClassName, 'Chrome_RenderWidgetHost') and @FrameworkId='Chrome']/Group[@FrameworkId='Chrome' and @LocalizedControlType='主要']/Button[@FrameworkId='Chrome']`);

        console.log("Found", articles.length, "articles.");
        // console.log(articles[0]);
        // console.log(articles[5]);
        console.log(await articles[5].checkVisibility())
        console.log("Scrolling to article 5", await articles[5].getLocator());
        await articles[5].scrollIntoView(`/Document`,{ direction: 'down', autoDelta: true });
        console.log("Article 5 scrolled into view");
        console.log(await articles[5].checkVisibility())
        // console.log(articles[5]);
        // console.log(articles.length);

        //for (let i = 0; i < Math.min(3, articles.length); i++) {
            // 每次循环重新查找元素，避免 stale element 问题
            // const currentArticles = await flow.findAll(`/Document[starts-with(@ClassName, 'Chrome_RenderWidgetHost') and @FrameworkId='Chrome']/Group[@FrameworkId='Chrome' and @LocalizedControlType='主要']/Button[@FrameworkId='Chrome']`);
            
            // if (i >= currentArticles.length) {
            //     console.log("文章列表已变化，退出循环");
            //     break;
            // }
            
            // const article = articles[i];
            // console.log("Wait for 10 seconds")
            // await flow.wait(1000);
            // console.log('===========11111===========')
            // console.log(await article.xpath())
            // console.log('===========22222===========')
            // console.log(await article.xpath("name"))




            // console.log("正在处理文章：", article.info.name)
            // await article.click();
            // await flow.wait(5000);

            // if (await flow.exists(`/Document/Button[@AutomationId='js_focus']`)) {
            //     await flow.click(`/Document/Button[@AutomationId='js_focus']`);
            //     await flow.wait(2000);

            //     //滚动鼠标看文章
            //     await flow.scrollDown(`/Document`, { wait: `/Document/Text[@Name='写留言']` });

            //     await flow.scrollToVisible(`/Document/Text[@Name='写留言']`, `/Document`);

            //     await flow.click(`/Document/Text[@Name='写留言']`);


            //     if (flow.exists(`/Document/Button[@Name='发送']`)) {

            //         let document = await flow.find(`/Document[@FrameworkId='Chrome']`);
            //         let articleTitle = document.info.name;
            //         console.log("准备写文章留言：", articleTitle)
            //         let comment = await generateLLMComment(articleTitle);

            //         console.log("评论：", comment);




            //         await flow.type(comment)
            //         await flow.click(`/Document/Button[@Name='发送']`);

            //         // 激活微信浏览器，关闭标签直到 document.info.name ends with "- 文章 - 搜一搜"



            //     }
            // }
            // else {
            //     console.log("已经关注，跳过这篇文章");
            // }

            // // 关闭当前文章标签，返回列表页
            // for (let j = 0; j < 10; j++) {
            //     if (!await flow.exists(`/Document[@FrameworkId='Chrome']`)) {
            //         await flow.window({ title: `微信`, className: `Chrome_WidgetWin_0`, processName: `WeChatAppEx` });
            //     }

            //     let tabItem = await flow.find(`/Document[@FrameworkId='Chrome']`);
            //     if (tabItem.info.name.endsWith("- 文章 - 搜一搜")) {
            //         console.log("已返回文章列表页");
            //         break;
            //     }
            //     else {
            //         await flow.shortcut("Ctrl+F4");
            //         await flow.wait(1000);
            //     }
            // }
            
            // // 等待列表页完全加载
            // await flow.wait(2000);
        //}

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
