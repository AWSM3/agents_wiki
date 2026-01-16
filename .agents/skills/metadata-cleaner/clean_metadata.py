#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent Skill: Metadata Cleaner
Очищает метаданные в markdown файлах, оставляя только указанные поля.
"""

import argparse
import os
import re
import sys
from pathlib import Path
from typing import List, Set

# Исправление кодировки для Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


class MetadataCleaner:
    """Класс для очистки метаданных в markdown файлах."""
    
    def __init__(self, keep_fields: Set[str] = None):
        """
        Инициализация очистителя метаданных.
        
        Args:
            keep_fields: Набор полей метаданных, которые нужно сохранить.
                        По умолчанию: {'Last reviewed', 'Уровень'}
        """
        self.keep_fields = keep_fields or {'Last reviewed', 'Уровень'}
        # Паттерн для строк метаданных (начинаются с "- **")
        self.metadata_pattern = re.compile(r'^-\s+\*\*([^*]+)\*\*:', re.IGNORECASE)
    
    def should_keep_line(self, line: str) -> bool:
        """
        Проверяет, нужно ли сохранить строку метаданных.
        
        Args:
            line: Строка для проверки
            
        Returns:
            True если строку нужно сохранить, False если удалить
        """
        match = self.metadata_pattern.match(line.strip())
        if not match:
            return True  # Не метаданные - сохраняем
        
        field_name = match.group(1).strip()
        return field_name in self.keep_fields
    
    def clean_file(self, file_path: Path, dry_run: bool = False) -> dict:
        """
        Очищает метаданные в одном файле.
        
        Args:
            file_path: Путь к файлу
            dry_run: Если True, только показывает изменения без записи
            
        Returns:
            Словарь с результатами: {'removed': int, 'kept': int, 'changed': bool}
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"❌ Ошибка чтения {file_path}: {e}")
            return {'removed': 0, 'kept': 0, 'changed': False, 'error': str(e)}
        
        new_lines = []
        removed_count = 0
        kept_count = 0
        in_header = False
        header_ended = False
        
        for i, line in enumerate(lines):
            # Определяем, находимся ли мы в секции заголовка (первые строки до первого ##)
            if i == 0 or (i < 10 and not header_ended):
                if line.strip().startswith('##'):
                    header_ended = True
                elif line.strip().startswith('# '):
                    in_header = True
                elif line.strip().startswith('- **'):
                    in_header = True
            
            # Если это строка метаданных в заголовке
            if in_header and not header_ended and self.metadata_pattern.match(line.strip()):
                if self.should_keep_line(line):
                    new_lines.append(line)
                    kept_count += 1
                else:
                    removed_count += 1
                    if dry_run:
                        print(f"  [-] {line.rstrip()}")
            else:
                new_lines.append(line)
        
        changed = removed_count > 0
        
        if changed and not dry_run:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f"✅ {file_path}: удалено {removed_count} строк(и)")
            except Exception as e:
                print(f"❌ Ошибка записи {file_path}: {e}")
                return {'removed': 0, 'kept': 0, 'changed': False, 'error': str(e)}
        elif changed and dry_run:
            print(f"🔍 {file_path}: будет удалено {removed_count} строк(и)")
        
        return {
            'removed': removed_count,
            'kept': kept_count,
            'changed': changed
        }
    
    def clean_directory(self, directory: Path, extension: str = '.md', 
                       recursive: bool = False, dry_run: bool = False) -> dict:
        """
        Очищает метаданные во всех файлах директории.
        
        Args:
            directory: Путь к директории
            extension: Расширение файлов для обработки
            recursive: Рекурсивный обход поддиректорий
            dry_run: Если True, только показывает изменения без записи
            
        Returns:
            Словарь со статистикой обработки
        """
        if not directory.exists():
            print(f"❌ Директория не найдена: {directory}")
            return {'processed': 0, 'changed': 0, 'errors': 0}
        
        pattern = f"**/*{extension}" if recursive else f"*{extension}"
        files = list(directory.glob(pattern))
        
        if not files:
            print(f"⚠️  Файлы с расширением {extension} не найдены в {directory}")
            return {'processed': 0, 'changed': 0, 'errors': 0}
        
        print(f"\n{'🔍 РЕЖИМ ПРЕДПРОСМОТРА' if dry_run else '🚀 ОБРАБОТКА ФАЙЛОВ'}")
        print(f"Директория: {directory}")
        print(f"Найдено файлов: {len(files)}\n")
        
        total_removed = 0
        total_kept = 0
        changed_files = 0
        errors = 0
        
        for file_path in files:
            result = self.clean_file(file_path, dry_run)
            if 'error' in result:
                errors += 1
            else:
                total_removed += result['removed']
                total_kept += result['kept']
                if result['changed']:
                    changed_files += 1
        
        print(f"\n{'=' * 60}")
        print(f"📊 СТАТИСТИКА:")
        print(f"  Обработано файлов: {len(files)}")
        print(f"  Изменено файлов: {changed_files}")
        print(f"  Удалено строк: {total_removed}")
        print(f"  Сохранено строк метаданных: {total_kept}")
        if errors:
            print(f"  ⚠️  Ошибок: {errors}")
        print(f"{'=' * 60}\n")
        
        return {
            'processed': len(files),
            'changed': changed_files,
            'removed': total_removed,
            'kept': total_kept,
            'errors': errors
        }


def main():
    """Основная функция для запуска из командной строки."""
    parser = argparse.ArgumentParser(
        description='Очистка метаданных в markdown файлах',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Примеры использования:

  # Предпросмотр изменений в текущей директории
  python clean_metadata.py --dry-run

  # Очистка всех .md файлов в директории content/
  python clean_metadata.py -d content/

  # Рекурсивная очистка с другим расширением
  python clean_metadata.py -d docs/ -e .markdown -r

  # Сохранить другие поля
  python clean_metadata.py -d content/ -k "Owner" -k "Статус" -k "Last reviewed"

  # Очистка одного файла
  python clean_metadata.py -f content/01_Start_Here/01_01_What_Agents_Are.md
        """
    )
    
    parser.add_argument(
        '-d', '--directory',
        type=str,
        help='Директория для обработки (по умолчанию: текущая)'
    )
    
    parser.add_argument(
        '-f', '--file',
        type=str,
        help='Обработать один конкретный файл'
    )
    
    parser.add_argument(
        '-e', '--extension',
        type=str,
        default='.md',
        help='Расширение файлов для обработки (по умолчанию: .md)'
    )
    
    parser.add_argument(
        '-r', '--recursive',
        action='store_true',
        help='Рекурсивный обход поддиректорий'
    )
    
    parser.add_argument(
        '-k', '--keep',
        action='append',
        help='Поле метаданных для сохранения (можно указать несколько раз)'
    )
    
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Предпросмотр изменений без записи в файлы'
    )
    
    args = parser.parse_args()
    
    # Определяем поля для сохранения
    keep_fields = set(args.keep) if args.keep else {'Last reviewed', 'Уровень'}
    
    cleaner = MetadataCleaner(keep_fields=keep_fields)
    
    # Обработка одного файла или директории
    if args.file:
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"❌ Файл не найден: {file_path}")
            return 1
        
        print(f"\n{'🔍 РЕЖИМ ПРЕДПРОСМОТРА' if args.dry_run else '🚀 ОБРАБОТКА ФАЙЛА'}")
        print(f"Файл: {file_path}\n")
        
        result = cleaner.clean_file(file_path, args.dry_run)
        
        if 'error' in result:
            return 1
        
        print(f"\n{'=' * 60}")
        print(f"📊 РЕЗУЛЬТАТ:")
        print(f"  Удалено строк: {result['removed']}")
        print(f"  Сохранено строк метаданных: {result['kept']}")
        print(f"{'=' * 60}\n")
        
    else:
        directory = Path(args.directory) if args.directory else Path.cwd()
        cleaner.clean_directory(
            directory=directory,
            extension=args.extension,
            recursive=args.recursive,
            dry_run=args.dry_run
        )
    
    return 0


if __name__ == '__main__':
    exit(main())
