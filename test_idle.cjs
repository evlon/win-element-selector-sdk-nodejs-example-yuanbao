/**
 * 测试 idle 功能
 */

const { SDK } = require('element-selector-sdk-nodejs');

async function testIdle() {
    console.log('=== 测试 idle 功能 ===\n');

    const sdk = new SDK({
        baseUrl: 'http://localhost:8080',
        logging: {
            enabled: true,
            level: 'info',
            showElementInfo: true,
        }
    });

    const flow = sdk.flow();
    
    try {
        // 激活窗口
        console.log('📌 Step 1: 激活窗口...');
        await flow.window({
            title: '元宝',
            className: 'Tauri Window',
            processName: 'yuanbao'
        });
        console.log('✓ 窗口激活成功\n');

        // 测试 idle 功能
        console.log('📌 Step 2: 启动空闲移动...');
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'normal',
            moveInterval: 800
        });
        console.log('✓ 空闲移动已启动');
        
        // 等待观察效果
        console.log('⏳ 观察 5 秒内的鼠标移动...\n');
        await flow.wait(5000);
        
        // 停止空闲移动
        await flow.stopIdle();
        console.log('✓ 空闲移动已停止\n');

        console.log('\n✅ 测试完成!');
        
    } catch (error) {
        console.error('\n❌ 发生错误');
        if (error instanceof Error) {
            console.error(`   错误类型: ${error.constructor.name}`);
            console.error(`   错误消息: ${error.message}`);
            if (error.stack) {
                console.error(`   堆栈跟踪:\n${error.stack}`);
            }
        }
        process.exit(1);
    }
}

testIdle();
