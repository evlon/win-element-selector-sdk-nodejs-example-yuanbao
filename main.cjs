/**
 * 元宝应用调试脚本（优化版）
 * 
 * 使用新的自动等待和日志功能
 */

const { SDK } = require('element-selector-sdk-nodejs');

async function debugYuanbao() {
    console.log('=== 元宝应用调试工具（优化版）===\n');
    
    // 配置自动等待和日志
    const sdk = new SDK({ 
        baseUrl: 'http://localhost:8080',
        autoWait: {
            enabled: true,
            delays: {
                afterFind: 500,
                afterClick: 800,
                afterType: 600,
            }
        },
        logging: {
            enabled: true,
            level: 'info',
            showElementInfo: true,
        }
    });
    
    const flow = sdk.flow();
    
    try {
        // 激活窗口
        await flow.window({ 
            title: '元宝', 
            className: 'Tauri Window',
            processName: 'yuanbao' 
        });
        
        // 查找并点击“新建对话”按钮
        const newChatBtn = await flow.find(
            `//Document[@AutomationId='RootWebArea']/Group/Group/Group[starts-with(@ClassName, 'temp-dialogue-btn_temp-dialogue') and @FrameworkId='Chrome']`
        );
        
        await newChatBtn.click();
        
        // 查找并点击输入区域
        const inputArea = await flow.find(
           `//Document[@AutomationId='RootWebArea']/Group/Group/Group/Group/Group/Group[@ClassName='ql-editor ql-blank']`
                );
        
        await inputArea.click();
        await inputArea.typeText('测试');
        
        // 查找并点击发送按钮
        const sendBtn = await flow.find(
        `//Document[@AutomationId='RootWebArea']/Group/Group/Group/Group/Group[@AutomationId='yuanbao-send-btn']/Image`   
        );
        
        await sendBtn.click();
        
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
        process.exit(1);
    }
}

debugYuanbao();
