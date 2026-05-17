/**
 * 测试 idle 功能的不同配置选项
 */

const { SDK } = require('element-selector-sdk-nodejs');

async function testIdleConfigurations() {
    console.log('=== 测试 idle 配置选项 ===\n');

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

        // 测试 1: 默认配置（人工干预检测启用）
        console.log('🧪 测试 1: 默认配置（检测到鼠标移动会暂停，3秒后恢复）');
        console.log('   配置: humanIntervention.enabled=true, pauseOnMouse=true, resumeDelay=3000\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'normal',
            moveInterval: 800
        });
        
        console.log('   ⏳ 观察 5 秒，然后移动你的鼠标...\n');
        await flow.wait(5000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 1 完成\n');
        await flow.wait(1000);

        // 测试 2: 禁用人工干预检测
        console.log('🧪 测试 2: 禁用人工干预检测（鼠标移动不会暂停）');
        console.log('   配置: humanIntervention.enabled=false\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'normal',
            moveInterval: 800,
            humanIntervention: {
                enabled: false
            }
        });
        
        console.log('   ⏳ 观察 5 秒，移动鼠标也不会暂停...\n');
        await flow.wait(5000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 2 完成\n');
        await flow.wait(1000);

        // 测试 3: 检测但不自动恢复
        console.log('🧪 测试 3: 检测到鼠标移动暂停，但不自动恢复');
        console.log('   配置: pauseOnMouse=true, resumeDelay=0\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'normal',
            moveInterval: 800,
            humanIntervention: {
                enabled: true,
                pauseOnMouse: true,
                resumeDelay: 0  // 不自动恢复
            }
        });
        
        console.log('   ⏳ 观察 3 秒，然后移动鼠标（会暂停且不会自动恢复）...\n');
        await flow.wait(3000);
        
        console.log('   ⏸️  已暂停，等待 5 秒后手动停止...\n');
        await flow.wait(5000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 3 完成\n');
        await flow.wait(1000);

        // 测试 4: 延长恢复时间
        console.log('🧪 测试 4: 延长自动恢复时间到 10 秒');
        console.log('   配置: pauseOnMouse=true, resumeDelay=10000\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'normal',
            moveInterval: 800,
            humanIntervention: {
                enabled: true,
                pauseOnMouse: true,
                resumeDelay: 10000  // 10秒后恢复
            }
        });
        
        console.log('   ⏳ 观察 3 秒，然后移动鼠标（10秒后才会恢复）...\n');
        await flow.wait(3000);
        
        console.log('   ⏸️  已暂停，等待 5 秒（还未恢复）...\n');
        await flow.wait(5000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 4 完成\n');

        console.log('\n✅ 所有测试完成!');
        console.log('\n💡 配置建议:');
        console.log('   • 防检测场景: humanIntervention.enabled=false（持续移动）');
        console.log('   • 友好交互: humanIntervention.resumeDelay=10000（给用户更多时间）');
        console.log('   • 完全控制: humanIntervention.resumeDelay=0（手动控制恢复）');
        
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

testIdleConfigurations();
