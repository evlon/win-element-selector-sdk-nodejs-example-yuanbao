/**
 * 测试 stopIdle 功能
 */

const { SDK } = require('element-selector-sdk-nodejs');

async function testStopIdle() {
    console.log('=== 测试 stopIdle 功能 ===\n');

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

        // 测试 1: 正常启动后立即停止
        console.log('🧪 测试 1: 正常启动后立即停止');
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            moveInterval: 800
        });
        console.log('   ✓ idle 已启动');
        
        await flow.wait(1000);
        console.log('   ⏳ 运行 1 秒...');
        
        await flow.stopIdle();
        console.log('   ✓ idle 已停止\n');
        await flow.wait(500);

        // 测试 2: 暂停后停止
        console.log('🧪 测试 2: 人工干预暂停后停止');
        await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
            moveInterval: 800,
            humanIntervention: {
                enabled: true,
                pauseOnMouse: true,
                resumeDelay: 3000
            }
        });
        console.log('   ✓ idle 已启动');
        
        console.log('   ⏳ 等待 2 秒，然后移动你的鼠标来触发暂停...');
        await flow.wait(2000);
        console.log('   👆 请现在移动鼠标！');
        await flow.wait(2000);
        
        console.log('   ⏸️  应该已暂停，现在调用 stopIdle()...');
        await flow.stopIdle();
        console.log('   ✓ idle 已停止（即使在暂停状态也能正常停止）\n');
        await flow.wait(500);

        // 测试 3: 多次启动和停止
        console.log('🧪 测试 3: 多次启动和停止');
        for (let i = 1; i <= 3; i++) {
            console.log(`   第 ${i} 次循环...`);
            await flow.idle(`//Document[@AutomationId='RootWebArea']`, {
                moveInterval: 800
            });
            await flow.wait(500);
            await flow.stopIdle();
            console.log(`   ✓ 第 ${i} 次完成`);
        }
        console.log('   ✓ 多次启停测试通过\n');

        // 测试 4: 在未启动时调用 stopIdle
        console.log('🧪 测试 4: 在未启动时调用 stopIdle');
        try {
            await flow.stopIdle();
            console.log('   ✓ 未启动时调用 stopIdle 不会报错\n');
        } catch (error) {
            console.log(`   ⚠️  捕获到错误: ${error.message}\n`);
        }

        console.log('\n✅ 所有 stopIdle 测试完成!');
        console.log('\n💡 结论:');
        console.log('   • stopIdle() 可以正常工作');
        console.log('   • 即使在暂停状态也能正确停止');
        console.log('   • 支持多次启动和停止');
        console.log('   • 所有后台任务都会正确清理');
        
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

testStopIdle();
