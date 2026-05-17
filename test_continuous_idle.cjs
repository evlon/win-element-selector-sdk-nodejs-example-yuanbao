/**
 * 测试连续流畅的 idle 移动
 */

const { SDK } = require('element-selector-sdk-nodejs');

async function testContinuousIdle() {
    console.log('=== 测试连续流畅 idle 移动 ===\n');

    const sdk = new SDK({
        baseUrl: 'http://localhost:8080',
        logging: {
            enabled: true,
            level: 'info',
            showElementInfo: false,
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

        // 测试 1: 正常速度 - 应该看到流畅连续的移动
        console.log('🧪 测试 1: 正常速度（流畅连续移动）');
        console.log('   配置: speed=normal, 无等待间隔\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'normal'
        });
        
        console.log('   ⏳ 观察 8 秒，注意鼠标应该是连续移动的...\n');
        await flow.wait(8000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 1 完成\n');
        await flow.wait(1000);

        // 测试 2: 慢速 - 更平滑但更慢
        console.log('🧪 测试 2: 慢速（非常平滑的移动）');
        console.log('   配置: speed=slow\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'slow'
        });
        
        console.log('   ⏳ 观察 5 秒...\n');
        await flow.wait(5000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 2 完成\n');
        await flow.wait(1000);

        // 测试 3: 快速 - 更快的切换
        console.log('🧪 测试 3: 快速（频繁改变方向）');
        console.log('   配置: speed=fast\n');
        
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            speed: 'fast'
        });
        
        console.log('   ⏳ 观察 5 秒...\n');
        await flow.wait(5000);
        
        await flow.stopIdle();
        console.log('   ✓ 测试 3 完成\n');

        console.log('\n✅ 所有测试完成!');
        console.log('\n💡 改进说明:');
        console.log('   • 移除了 move_interval 等待时间');
        console.log('   • 每次移动完成后立即生成新目标');
        console.log('   • 形成连续流畅的移动轨迹');
        console.log('   • 类似画不规则的圆/曲线');
        console.log('   • 有其他鼠标任务时会自动暂停');
        
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

testContinuousIdle();
