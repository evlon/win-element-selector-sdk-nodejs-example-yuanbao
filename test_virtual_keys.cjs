/**
 * 虚拟键输入示例
 * 
 * 演示如何在 type() 方法中使用虚拟键
 */

const { flow } = require('./src/index');

async function main() {
    console.log('=== 虚拟键输入示例 ===\n');

    try {
        // 示例 1: 基本文本输入后按回车
        console.log('示例 1: 输入文本后按回车');
        console.log('代码: await inputArea.type("测试内容{Enter}")');
        console.log('说明: 输入"测试内容"，然后按下 Enter 键\n');

        // 示例 2: 多行文本输入
        console.log('示例 2: 多行文本输入');
        console.log('代码: await inputArea.type("第一行{Enter}第二行{Enter}第三行")');
        console.log('说明: 输入三行文本，每行之间用 Enter 分隔\n');

        // 示例 3: 使用 Tab 切换字段
        console.log('示例 3: 使用 Tab 切换字段');
        console.log('代码: await field.type("用户名{Tab}密码{Enter}")');
        console.log('说明: 输入用户名，按 Tab 切换到下一个字段，输入密码，按 Enter 提交\n');

        // 示例 4: 输入包含花括号的文本（转义）
        console.log('示例 4: 输入包含花括号的文本');
        console.log('代码: await inputArea.type("配置项: {{key}} = value")');
        console.log('说明: 使用 {{ 和 }} 来输入字面意义的花括号\n');

        // 示例 5: 使用方向键
        console.log('示例 5: 使用方向键导航');
        console.log('代码: await inputArea.type("{Down}{Down}{Enter}")');
        console.log('说明: 按两次下方向键，然后按 Enter\n');

        // 示例 6: 使用功能键
        console.log('示例 6: 使用功能键');
        console.log('代码: await inputArea.type("{F5}")');
        console.log('说明: 按下 F5 刷新页面\n');

        // 示例 7: 组合使用多种虚拟键
        console.log('示例 7: 复杂表单填写');
        console.log('代码:');
        console.log('  await form.type("John{Tab}Doe{Tab}john@example.com{Tab}");');
        console.log('  await form.type("Password123{Enter}");');
        console.log('说明: 填写多个字段并提交表单\n');

        // 支持的虚拟键列表
        console.log('=== 支持的虚拟键列表 ===');
        console.log('{Enter} / {Return}     - 回车键');
        console.log('{Tab}                  - Tab 键');
        console.log('{Escape} / {Esc}       - ESC 键');
        console.log('{Backspace} / {Back}   - 退格键');
        console.log('{Delete} / {Del}       - 删除键');
        console.log('{Home}                 - Home 键');
        console.log('{End}                  - End 键');
        console.log('{PageUp} / {PgUp}      - Page Up 键');
        console.log('{PageDown} / {PgDn}    - Page Down 键');
        console.log('{Left} / {Right}       - 左右方向键');
        console.log('{Up} / {Down}          - 上下方向键');
        console.log('{F1} - {F12}           - 功能键');
        console.log('\n转义字符:');
        console.log('{{                     - 左花括号 {');
        console.log('}}                     - 右花括号 }');

        console.log('\n✓ 示例展示完成！');
        console.log('\n提示: 在实际使用时，需要先找到目标元素，然后调用 type() 方法。');
        console.log('例如:');
        console.log('  const inputArea = await flow.find("//Edit[@AutomationId=\'input\']");');
        console.log('  await inputArea.type("Hello{Enter}");');

        // 组合键说明
        console.log('\n=== 组合键使用说明 ===');
        console.log('注意: type() 方法不支持组合键，需要使用 shortcut()');
        console.log('\n示例:');
        console.log('  // 复制');
        console.log('  await flow.shortcut("Ctrl+C");');
        console.log('  ');
        console.log('  // 粘贴');
        console.log('  await flow.shortcut("Ctrl+V");');
        console.log('  ');
        console.log('  // 全选');
        console.log('  await flow.shortcut("Ctrl+A");');
        console.log('  ');
        console.log('  // 多修饰键');
        console.log('  await flow.shortcut("Ctrl+Shift+S");');
        console.log('  ');
        console.log('支持的修饰键: Ctrl, Shift, Alt, Win');
        console.log('\n向后兼容:');
        console.log('  pressShortcut() - 已废弃，请使用 shortcut()');

    } catch (error) {
        console.error('\n❌ 发生错误:', error.message);
    }
}

// 运行示例
main();
