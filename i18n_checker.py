"""
LabProGlobal i18n 检测脚本
全面扫描所有页面和组件，检测多语言实现状态
"""

import os
import sys
import re
import json
from pathlib import Path
from typing import Optional

# 解决 Windows PowerShell GBK 编码问题
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ========== 配置 ==========
ROOT = Path(r"E:\novatech-store")
APP_DIR = ROOT / "app"
COMPONENTS_DIR = ROOT / "components" / "store"
TRANSLATIONS_FILE = ROOT / "lib" / "i18n" / "translations.ts"

# ========== 工具函数 ==========

def read_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except:
        return ""

def extract_client_imports(content: str) -> list[str]:
    """提取所有 import 语句中的来源路径"""
    imports = re.findall(r"from ['\"]([^'\"]+)['\"]", content)
    return imports

def has_use_client(content: str) -> bool:
    return "'use client'" in content or '"use client"' in content

def has_use_i18n(content: str) -> bool:
    return "useI18n" in content and ("from '@/lib/i18n/context'" in content or 'from "@/lib/i18n/context"' in content)

def has_use_admin_i18n(content: str) -> bool:
    """检测是否使用 Admin 后台专用 i18n"""
    return "useAdminI18n" in content

def has_server_i18n(content: str) -> bool:
    """检测是否使用 Server Component i18n (getTranslation from @/lib/i18n/server)"""
    return "getTranslation" in content and ("from '@/lib/i18n/server'" in content or 'from "@/lib/i18n/server"' in content)

def get_delegated_component(content: str) -> Optional[str]:
    """检测 Server Component 是否委托给 Client Component"""
    patterns = [
        r"<(\w+)\s",  # <SomeComponent ...>
        r"import\s+\{(\s*\w+\s*,\s*)*\s*\}",  # named imports
    ]
    # 找 JSX 中的组件使用
    jsx_matches = re.findall(r"<([A-Z][a-zA-Z]+)\b", content)
    return jsx_matches[0] if jsx_matches else None

def detect_hardcoded_english(content: str) -> list[dict]:
    """
    检测硬编码英文字符串（用户可见文本）
    排除：import/export/interface/type/代码逻辑
    """
    issues = []

    # 跳过代码声明区域
    lines = content.split("\n")
    in_code_block = False
    in_import = False
    skip_until_brace = 0

    for i, line in enumerate(lines):
        lineno = i + 1
        stripped = line.strip()

        # 跳过 import 语句
        if stripped.startswith("import ") or stripped.startswith("export "):
            continue
        # 跳过 interface / type 声明
        if stripped.startswith("interface ") or stripped.startswith("type ") or stripped.startswith("const ") or stripped.startswith("function ") or stripped.startswith("async function "):
            continue
        # 跳过注释
        if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*") or stripped.startswith("*/"):
            continue
        if "*/" in stripped:
            continue

        # 跳过 metadata 定义（只检测用户可见 UI）
        if "generateMetadata" in stripped or "export const metadata" in stripped:
            continue

        # 跳过代码变量定义
        if re.match(r"^\s*(const|let|var)\s+\w+\s*=", stripped):
            continue
        if re.match(r"^\s*\w+\s*:\s*(string|number|boolean|Record|any)", stripped):
            continue

        # === 检测 JSX 中的硬编码英文文本 ===
        # 匹配 {t.something} 或 t.xxx 形式 - 这些是国际化了的
        # 匹配 placeholder="..." 属性值 - 可能是占位符文本
        # 匹配 >Hardcoded Text< 或 className="...英文..." 不靠谱
        # 匹配 JSX 标签内裸字符串: <tag>Hardcoded</tag> 或 {label: "Hardcoded"}

        # 1. JSX 元素中的裸英文字符串（非属性值）
        #    模式: >English Text< 但排除 {t.xxx} 和 {变量}
        #    找到 JSX 标签内的文本节点
        jsx_text_pattern = re.findall(
            r">\s*([A-Z][a-zA-Z]{2,}(?:\s+[A-Za-z][a-zA-Z]{2,}){0,5})\s*<",
            line
        )
        for match in jsx_text_pattern:
            # 排除包含 t. 的行（国际化了）
            context = line
            if f"t.{match.lower().replace(' ', '_')}" not in context.lower() and match not in ["Loading..."]:
                issues.append({
                    "lineno": lineno,
                    "type": "jsx_text",
                    "text": match,
                    "sample": line.strip()[:80],
                })

        # 2. placeholder="..." 属性中的英文字符串
        placeholders = re.findall(r'placeholder\s*=\s*"([^"]{3,})"', line)
        for ph in placeholders:
            # 排除已用 t.xxx 的
            if "t." not in line and ph not in ["$", "0", "1", "10"]:
                issues.append({
                    "lineno": lineno,
                    "type": "placeholder",
                    "text": ph,
                    "sample": line.strip()[:80],
                })

        # 3. aria-label="..." 属性
        aria_labels = re.findall(r'aria-label\s*=\s*"([^"]+)"', line)
        for al in aria_labels:
            if "t." not in line:
                issues.append({
                    "lineno": lineno,
                    "type": "aria_label",
                    "text": al,
                    "sample": line.strip()[:80],
                })

        # 4. JSX 中的字符串数组定义，如 label: 'English Text'
        #    匹配 label: 'Text', label: "Text"
        label_texts = re.findall(r"(?:label|title|text|msg|error|placeholder)\s*:\s*['\"]([A-Za-z][A-Za-z ]{2,})['\"]", line)
        for lt in label_texts:
            if "t." not in line:
                issues.append({
                    "lineno": lineno,
                    "type": "string_prop",
                    "text": lt,
                    "sample": line.strip()[:80],
                })

        # 5. statusConfig 等 Record 中的硬编码英文标签
        if re.search(r"label:\s*['\"]([A-Za-z][A-Za-z ]{2,})['\"]", line):
            match = re.search(r"label:\s*['\"]([A-Za-z][A-Za-z ]{2,})['\"]", line)
            if match and "t." not in line:
                issues.append({
                    "lineno": lineno,
                    "type": "status_label",
                    "text": match.group(1),
                    "sample": line.strip()[:80],
                })

    return issues

def get_translation_keys(content: str) -> set[str]:
    """提取 translations.ts 中所有翻译键名"""
    keys = re.findall(r"^\s{2,4}(\w+):\s*string", content, re.MULTILINE)
    return set(keys)

def check_page_i18n(page_path: Path) -> dict:
    """检测单个页面的 i18n 状态"""
    content = read_file(page_path)

    relative = str(page_path.relative_to(ROOT)).replace("\\", "/")

    is_client = has_use_client(content)
    has_i18n = has_use_i18n(content) or has_use_admin_i18n(content) or has_server_i18n(content)

    # 检测是否委托给已有多语言的 Client Component
    delegated_to = None
    if not has_i18n and not is_client:
        # 找 <SomeClient .../> 这样的 JSX
        matches = re.findall(r"<([A-Z][A-Za-z]+)\s", content)
        if matches:
            delegated_to = matches[0]

    issues = detect_hardcoded_english(content)

    # 判断状态
    if has_i18n and len(issues) == 0:
        status = "[OK] OK"
    elif has_i18n and len(issues) > 0:
        status = "[!] 部分硬编码"
    elif delegated_to and (delegated_to.endswith("Client") or delegated_to.endswith("-client")):
        status = "[->] 委托给 Client"
    else:
        status = "[X] 缺失 i18n"

    return {
        "path": relative,
        "is_client": is_client,
        "has_i18n": has_i18n,
        "delegated_to": delegated_to,
        "hardcoded_count": len(issues),
        "issues": issues[:5],  # 最多显示5个
        "status": status,
    }

def check_component_i18n(comp_path: Path) -> dict:
    """检测组件的 i18n 状态"""
    content = read_file(comp_path)

    relative = str(comp_path.relative_to(ROOT)).replace("\\", "/")

    is_client = has_use_client(content)
    has_i18n = has_use_i18n(content) or has_use_admin_i18n(content) or has_server_i18n(content)
    issues = detect_hardcoded_english(content)

    if has_i18n and len(issues) == 0:
        status = "[OK] OK"
    elif has_i18n and len(issues) > 0:
        status = "[!] 部分硬编码"
    elif is_client and not has_i18n:
        status = "[X] Client无i18n"
    else:
        status = "[->] 纯展示组件"

    return {
        "path": relative,
        "is_client": is_client,
        "has_i18n": has_i18n,
        "hardcoded_count": len(issues),
        "issues": issues[:5],
        "status": status,
    }

def run():
    print("=" * 60)
    print("LabProGlobal i18n 多语言检测报告")
    print("=" * 60)
    print()  # blank line

    # ========== 1. 扫描所有 app 页面 ==========
    pages_results = []
    for page_path in APP_DIR.rglob("page.tsx"):
        result = check_page_i18n(page_path)
        pages_results.append(result)

    # ========== 2. 扫描 components/store 中所有组件 ==========
    comp_results = []
    for comp_path in COMPONENTS_DIR.rglob("*.tsx"):
        result = check_component_i18n(comp_path)
        comp_results.append(result)

    # ========== 3. 读取翻译文件，统计键数量 ==========
    translations_content = read_file(TRANSLATIONS_FILE)
    en_keys = get_translation_keys(translations_content)
    locale_count = len(re.findall(r"^\s+[a-z]{2}:\s*\{", translations_content, re.MULTILINE))

    # ========== 4. 汇总统计 ==========
    pages_with_i18n = sum(1 for r in pages_results if r["has_i18n"])
    pages_without_i18n = [r for r in pages_results if not r["has_i18n"] and r["status"] == "[X] 缺失 i18n"]
    pages_delegated = [r for r in pages_results if r["status"] == "[->] 委托给 Client"]

    comps_with_i18n = sum(1 for r in comp_results if r["has_i18n"])
    comps_missing_i18n = [r for r in comp_results if r["status"] == "[X] Client无i18n"]

    # ========== 5. 输出报告 ==========
    print(f"[统计] 翻译文件统计")
    print(f"   支持语言: {locale_count} 种 (en/zh/es/ja/hi/ar/pt)")
    print(f"   翻译键数量: {len(en_keys)} 个")

    print(f"[页面] 扫描结果 ({len(pages_results)} 个页面)")
    print(f"   [OK]  已有多语言: {pages_with_i18n}")
    print(f"   [X]   缺失 i18n: {len(pages_without_i18n)}")
    print(f"   [->]  委托 Client: {len(pages_delegated)}")

    print(f"[组件] 扫描结果 ({len(comp_results)} 个组件)")
    print(f"   [OK]  已有多语言: {comps_with_i18n}")
    print(f"   [X]   Client 无 i18n: {len(comps_missing_i18n)}")

    # ========== 6. 详细问题列表 ==========
    print(f"\n{'='*60}")
    print("[X] 需要修复的页面（缺失 i18n）")
    print("=" * 60)
    if pages_without_i18n:
        for r in pages_without_i18n:
            print(f"  [PAGE] {r['path']}")
            print(f"         状态: {r['status']}")
            for issue in r['issues']:
                print(f"       L{issue['lineno']} [{issue['type']}]: \"{issue['text']}\"")
    else:
        print("  [OK] 所有页面均已实现多语言！")

    print(f"\n{'='*60}")
    print("[X] 需要修复的组件（Client Component 但未使用 i18n）")
    print("=" * 60)
    if comps_missing_i18n:
        for r in comps_missing_i18n:
            print(f"  [COMP] {r['path']}")
            print(f"        硬编码文本数: {r['hardcoded_count']} 处")
            for issue in r['issues']:
                print(f"        L{issue['lineno']} [{issue['type']}]: \"{issue['text']}\"")
    else:
        print("  [OK] 所有组件均已实现多语言！")

    print(f"\n{'='*60}")
    print("[!] 部分硬编码的组件（已用 i18n 但仍有个别英文）")
    print("=" * 60)
    partially_hardcoded = [r for r in comp_results if r["status"] == "[!] 部分硬编码"]
    for r in partially_hardcoded:
        print(f"  [COMP] {r['path']} ({r['hardcoded_count']} 处)")
        for issue in r['issues']:
            print(f"       L{issue['lineno']} [{issue['type']}]: \"{issue['text']}\"")

    # ========== 7. 生成 JSON 输出（供程序读取） ==========
    output = {
        "summary": {
            "total_pages": len(pages_results),
            "pages_with_i18n": pages_with_i18n,
            "pages_missing_i18n": len(pages_without_i18n),
            "total_components": len(comp_results),
            "components_with_i18n": comps_with_i18n,
            "components_missing_i18n": len(comps_missing_i18n),
            "translation_keys_count": len(en_keys),
            "supported_locales": locale_count,
        },
        "pages_missing": [r["path"] for r in pages_without_i18n],
        "components_missing": [r["path"] for r in comps_missing_i18n],
        "pages_needing_review": pages_results,
        "components_needing_review": comp_results,
    }

    output_path = ROOT / "i18n_report.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n[文件] 详细报告已保存: {output_path}")
    print("\n[DONE] i18n 检测完成！")
    return output

if __name__ == "__main__":
    run()
